import * as files from '../../../files/src/index.js'


const checkTopLevel = (filesystem, extension) => {
    return Object.keys(filesystem).reduce((a,b) => a + (
        b.includes(`.${extension}`)
    ), 0) !== 0 
}

export default async (fileList, options, callback) => {
    const bidsFiles = {
        format: 'bids',
        system: {},
        types: {},
        n: 0
    }

    // ---------------------- Load Files ----------------------
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
        const fileManager = await files.get(file).catch(e => console.error(e))

        // filesystem
        target[file.name] = fileManager

        // filetype
        const extension = fileManager.extension
        if (extension){
            const shortName = file.name.replace(`.${extension}`, '')
            if (!bidsFiles.types[extension]) bidsFiles.types[extension] = {}
            bidsFiles.types[extension][shortName] = fileManager
        } else {
            bidsFiles.types[file.name] = fileManager // e.g. README, CHANGES
        }


        // keep track of how many
        bidsFiles.n++
       if (callback instanceof Function) callback(bidsFiles.n/fileList.length, fileList.length)
       return true // Done!
    })

    const tic = performance.now()
    await Promise.allSettled(dataPromises)
    const toc = performance.now()
    if (options.debug) console.warn(`Time to Load Files: ${toc-tic}ms`)
 
    const rejected = dataPromises.filter(result => result.status === 'rejected').map(result => result.reason)
    if (options.debug) console.warn('Rejected Files', rejected, dataPromises)

    if (checkTopLevel(bidsFiles.system, 'edf')) bidsFiles.format = 'edf' // replace bids with edf
    if (checkTopLevel(bidsFiles.system, 'nwb')) bidsFiles.format = 'nwb' // replace bids with nwb

    return bidsFiles
}