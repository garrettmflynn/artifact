
import * as files from '../../../files/src/index.js'

export default async (fileList) => {
    const o = {}
        
    // ---------------------- Load Files ----------------------
    const dataPromises = Array.from(Object.values(fileList)).map(async file => {
        let target = o

        // Drill into File Path
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
        const content = await files.get(file)

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