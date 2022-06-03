import express   from 'express'
// import utils     from '../utils.js'
const router   = express.Router();
// import database  from './db.js'

import { stat, createReadStream, readdirSync } from "fs";
import { promisify } from "util";
import { pipeline, Readable } from "stream";
const defaultFile = "./datasets/chbmp/sub-CBM00002/eeg/sub-CBM00002_task-protmap_eeg.edf";
const fileInfo = promisify(stat);

const isDirectory = dirent => dirent.isDirectory()
const getPaths = source => readdirSync(source, { withFileTypes: true })

// List Dataset Structure

let acc = {}

router.get("/datasets", async (req, res) => {

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

if (acc.data == null) drill('datasets', acc, 'data')

const string = JSON.stringify(acc.data)
res.writeHead(200, {
    "Content-Length": string.length,
    "Content-Type": "application/json"
});

const readable = new Readable();
pipeline(readable, res, err => console.log('Error', err));
Array.from(string).forEach(c => readable.push(c))
readable.push(null);
})

router.get("/datasets/:name*", async (req, res) => {

    const params = req.params
    console.log('params', params)
    console.log('file', defaultFile)
    
     /** Calculate Size of file */
     const { size } = await fileInfo(defaultFile);
     const range = req.headers.range;
 
     /** Check for Range header */
     console.log('range', req.headers.range)

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
        //  "Content-Type": "video/mp4"
       });
 
       let readable = createReadStream(defaultFile, { start: start, end: end });
       pipeline(readable, res, err => {
        console.log('Range Error', err);
        });
 
     } else {
 
       res.writeHead(200, {
         "Content-Length": size,
        //  "Content-Type": "video/mp4"
       });
 
       let readable = createReadStream(defaultFile);

       pipeline(readable, res, err => {
         console.log('Error', err);
       });
 
     }
})

export default router;
