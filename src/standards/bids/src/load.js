
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
        const data = await utils.files.getFileData(file)

        // Swap file mimeType if zipped
        let mimeType = file.type        
        const isZipped = (mimeType === "application/x-gzip")
        if (isZipped) name.pop()
        const extension = (originalLength === 1) ?  '' : name.pop() // No extension

        if (isZipped || !mimeType) mimeType = extensionToMimeType[extension]
        name = name.join('.')

        let target = o

        // Separate Derivatives
        const path = file.webkitRelativePath || file.relativePath || ''

        const toDrill = name.split('_').map(str => str.split('-'))
        // console.log('toDrill', name, mimeType, extension)

        if (path.includes('derivatives')) {
           const derivName = path.match(/derivatives\/(.+?)\//)[1]
           if (!o.derivatives[derivName]) o.derivatives[derivName] = {}
           target = o.derivatives[derivName]
        }

        let lastKey = null
        toDrill.forEach(([key, value]) => {
            if (!value) lastKey = key
            else {
                if (!target[key]) target[key] = {}
                if (!target[key][value]) target[key][value] = {}
                target = target[key][value] // replace target
            }
        })

        // Decode File Contents
        const content = await decode(data, mimeType, isZipped) 
        if (content) {
            if (!target[lastKey]) target[lastKey] = content
            else {
                console.log('FOUND METADATA', name, extension,  target[name], content)
                target[lastKey] = {
                    data: target[lastKey],
                    metadata: content
                }
            }
        } else {
            const msg = `No decoder for ${name}.${extension} - ${file.type || 'No file type recognized'}`
            console.warn(msg)
            reject(msg)
        }

        resolve(target[lastKey])
    })

    await Promise.allSettled(dataPromises)

    return o
}