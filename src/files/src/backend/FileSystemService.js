import { stat, createReadStream, readdirSync } from "fs";
import { promisify } from "util";
import mime from "mime-types";

import fileTypeLookup from '../lookup.js'

import { pipeline, Readable } from "stream";
const fileInfo = promisify(stat);

export default class FileSystemService {
    constructor(options={}) {
        this.root = options.root ?? ''
        this['404'] = options['404'] ?? ''
        this['#cache'] = {}
    }

    list = (req, res) => {

        const isDirectory = dirent => dirent.isDirectory()
        const getPaths = source => readdirSync(source, { withFileTypes: true })

        const drill = (name, o, key) => {
            const arr = getPaths('./' + name)
            arr.forEach(dirent => {
                const str = dirent.name 
                if (!o[key]) o[key] = {}
                let target = o[key]
                const path = name + '/' + str
                if (isDirectory(dirent)) {
                    if (!target[str]) target[str] = {}
                    drill(path, target, str)
                } else if (key) {
                    target[str] = path
                }
            })
        }
        
        if (this['#cache'].data == null) drill(this.root, this['#cache'], 'data')
        
        const string = JSON.stringify(this['#cache'].data)
        res.writeHead(200, {
            "Content-Length": string.length,
            "Content-Type": "application/json"
        });
        
        const readable = new Readable();
        pipeline(readable, res, err => console.log('Error', err));
        Array.from(string).forEach(c => readable.push(c))
        readable.push(null);
    }

    get = async (req, res) => {

        const filePath = `./${this.root}/${req.params['0']}` // ?? this['404']
        
         /** Calculate Size of file */
         const { size } = await fileInfo(filePath);
         let contentType = mime.contentType(filePath)
         if (contentType === filePath) {
             const split = filePath.split('.')
             const extension = split[split.length - 1]
             contentType = fileTypeLookup[extension] // Approximation through our API
         }

         const range = req.headers.range;
         
        /** Check for Range header */
         if (range) {
           /** Extracting Start and End value from Range Header */
           let [start, end] = range.replace(/bytes=/, "").split("-");
           start = parseInt(start, 10);
           end = end ? parseInt(end, 10) : size - 1;
     
           if (!isNaN(start) && isNaN(end)) {
             start = start;
             end = size - 1;
           }
           if (isNaN(start) && !isNaN(end)) {
             start = size - end;
             end = size - 1;
           }
     
           // Handle unavailable range request
           if (start >= size || end >= size) {
             // Return the 416 Range Not Satisfiable.
             res.writeHead(416, {
               "Content-Range": `bytes */${size}`
             });
             return res.end();
           }
     
           /** Sending Partial Content With HTTP Code 206 */
           res.writeHead(206, {
             "Content-Range": `bytes ${start}-${end}/${size}`,
             "Accept-Ranges": "bytes",
             "Content-Length": end - start + 1,
            "Content-Type": contentType
           });
     
           let readable = createReadStream(filePath, { start: start, end: end });
           pipeline(readable, res, err => {
            console.log('Range Error', err);
            });
     
         } else {
     
           res.writeHead(200, {
             "Content-Length": size,
             "Content-Type": contentType
           });
     
           let readable = createReadStream(filePath);
    
           pipeline(readable, res, err => {
             console.log('Error', err);
           });
     
         }
    }
}