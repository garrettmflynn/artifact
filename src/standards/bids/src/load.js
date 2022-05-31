import * as files from '../../../files/src/index.js'


const checkTopLevel = (filesystem, extension) => {
    return Object.keys(filesystem).reduce((a,b) => a + (
        b.includes(`.${extension}`)
    ), 0) !== 0 
}

export default async (fileList, callback) => {
    const bidsFiles = {
        format: 'bids',
        system: {},
        types: {},
        list: []
    }

    // ---------------------- Load Files ----------------------
    let count = 0
    const dataPromises = Array.from(Object.values(fileList)).map(async file => {
        let target = bidsFiles.system

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
        const {extension} = files.getInfo(file)
        const content = await files.get(file)

        if (content) {
            target[file.name] = content // filesystem target
            if (extension){
                if (!bidsFiles.types[extension]) bidsFiles.types[extension] = {}
                bidsFiles.types[extension][file.name.replace(`.${extension}`, '')] = content // filetypes extension
            } else bidsFiles.types[file.name] = content // e.g. README, CHANGES

            bidsFiles.list.push(content) // Create a full list of files
        }
        else {
            // if (!target[file.name]) target[file.name] = null
            const msg = `No decoder for ${file.name} - ${file.type || 'No file type recognized'}`
            console.warn(msg)
        }

       count++
       if (callback instanceof Function) callback(count/fileList.length, fileList.length)
       return target[file.name]
    })

    await Promise.allSettled(dataPromises)

    if (checkTopLevel(bidsFiles.system, 'edf')) bidsFiles.format = 'edf' // replace bids with edf
    if (checkTopLevel(bidsFiles.system, 'nwb')) bidsFiles.format = 'nwb' // replace bids with nwb

    return bidsFiles
}