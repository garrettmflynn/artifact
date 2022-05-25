
import decode from './decode'
import * as utils from './utils/index.js'


const extensionToMimeType = {
    'tsv': "text/tab-separated-values",
    'json': "application/json",
    'nii': "application/x-nii",
}


export default async (files) => {
    const o = {
        derivatives: {}
    }
        
    // ---------------------- Load Files ----------------------
    const dataPromises = Array.from(Object.values(files)).map(async file => {
        let name = file.name.split('.')
        const originalLength = name.length

        // Swap file mimeType if zipped
        let mimeType = file.type        
        const isZipped = (mimeType === "application/x-gzip")
        if (isZipped) name.pop()
 
        // Check Rogue Extensions
        let extension;
        if (originalLength === 1) {
            extension = '' // no extension provided
        } else if (name[0] === '') {
            name = [`.${name[1]}`] // e.g. .bidsignore
            extension = ''
        } else extension = name.pop() // Default extension syntax

        if (isZipped || !mimeType) mimeType = extensionToMimeType[extension]
        name = name.join('.')

        let target = o

        // Separate Derivatives
        const path = file.webkitRelativePath || file.relativePath || ''

        const toDrill = name.split('_').map(str => str.split('-'))

        if (path.includes('derivatives')) {
           const derivName = path.match(/derivatives\/(.+?)\//)[1]
           if (!o.derivatives[derivName]) o.derivatives[derivName] = {}
           target = o.derivatives[derivName]
        }

        let suffix = ''
        toDrill.forEach(([key, value]) => {
            if (!value) suffix = key
            else {
                if (!target[key]) target[key] = {}
                if (!target[key][value]) target[key][value] = {}
                target = target[key][value] // replace target
            }
        })

        // Decode File Contents
        const data = await utils.files.getFileData(file, extension)
        const content = await decode(data, mimeType, isZipped)
        if (content) {
            target[file.name] = content
        } else {
            if (!target[file.name]) target[file.name] = null
            const msg = `No decoder for ${file.name} - ${file.type || 'No file type recognized'}`
            console.warn(msg)
            reject(msg)
        }

        resolve(target[lastKey])
    })

    await Promise.allSettled(dataPromises)

    return o
}