
import * as files from '../../../files/src/index.js'
import JSZip from 'jszip';

export default (bidsFiles, callback) => {

    return new Promise(async resolve => {
        
    const zip = new JSZip();
    const keywords = ['sub', 'ses']

    // Asynchronously Drill Files
    let count = 0
    const drill = async (subObj, file, prefixKey) => {
        return await Promise.allSettled(Object.keys(subObj).map(async key => {
            const splitKey = key.split('.')
            const notKeyword = keywords.map(k => key !== k).reduce((a,b) => a * b, true)
            if (!notKeyword) return await drill(subObj[key], file, key) // Special files
            else if (splitKey.length === 1 && (typeof subObj[key] === 'object')) {
                return await drill(subObj[key], file.folder(prefixKey ? `${prefixKey}-${key}` : key))
            } else {
                const fileContents = subObj[key]
                // if (key.includes('.gz')) key = key.replace('.gz', '') // Skip compression...
                const returned = await files.encode(key, fileContents).catch(e => console.error(e))
                count++
                callback(count / bidsFiles.list.length, bidsFiles.list.length) // TODO: Make this account for new files added for HED tags...
                file.file(key, returned) // Encoded file
            }
        }))
    }
    await drill(bidsFiles.system, zip)

    // Generate .zip file
    zip.generateAsync({type:"blob"}).then((content) => resolve(content))
})
}