
import decode from './decode'
import * as utils from './utils/index.js'
import { extensionToMimeType } from '.'


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

        let firstDrill = path.split('/').slice(1)
        firstDrill = firstDrill.slice(0, firstDrill.length - 1)

        const toDrill = Array.from(new Set([
            ...firstDrill, 
            // ...name.split('_')
        ])).map(str => str.split('-'))

        toDrill.forEach(([key, value]) => {
            if (!target[key]) target[key] = {}
            target = target[key]

            if (value) {
                if (!target[value]) target[value] = {}
                target = target[value] // replace target
            }
        })
        

        // Decode File Contents
        const data = await utils.files.getFileData(file, extension)
        const content = await decode(data, mimeType, isZipped)

        if (content) target[file.name] = content
        else {
            if (!target[file.name]) target[file.name] = null
            const msg = `No decoder for ${file.name} - ${file.type || 'No file type recognized'}`
            console.warn(msg)
        }

       return target[file.name]
    })

    await Promise.allSettled(dataPromises)

    return o
}