
import * as files from './files.js'
import {RangeFile} from 'freerange'
import JSZip from 'jszip';

export default (bidsFiles, options, callback) => {

    return new Promise(async resolve => {
        
    const zip = new JSZip();
    const keywords = ['sub', 'ses']

    // Asynchronously Drill Files
    let count = 0
    const files = []
    const drill = async (subObj, file, prefixKey) => {
        return await Promise.allSettled(Object.keys(subObj).map(async key => {
            const splitKey = key.split('.')
            const notKeyword = keywords.map(k => key !== k).reduce((a,b) => a * b, true)
            if (subObj[key] instanceof RangeFile){
                const rangeFile = subObj[key]
                const returned = rangeFile.file
                console.log('Exporting', key, returned)
                count++
                callback(count / bidsFiles.n, bidsFiles.n) // TODO: Make this account for new files added for HED tags...
                file.file(key, returned) // Encoded file
                files.push(returned)
            } else if (!notKeyword) {
                return await drill(subObj[key], file, key) // Special files
            } else if (splitKey.length === 1 && (typeof subObj[key] === 'object')) {
                return await drill(subObj[key], file.folder(prefixKey ? `${prefixKey}-${key}` : key))
            }
        }))
    }

    const tic = performance.now()
    await drill(bidsFiles.system, zip)
    const toc = performance.now()
    if (options.debug) console.warn(`Time to Get File Buffers: ${toc-tic}ms`)

    // Generate .zip file
    zip.generateAsync({type:"blob"}).then((zip) => resolve({zip, files}))
})
}