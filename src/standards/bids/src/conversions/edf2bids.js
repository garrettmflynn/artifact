import { keywords } from './index.js'

const validModalities = ['eeg']

export default (files) => {

    for (let fileName in files.system) {
        const fileData = files.system[fileName]
        const split = fileName.split('_').map(str => str.split('-')).filter(arr => keywords.includes(arr[0]))
        const fileModality = fileName.split('_').at(-1).split('.')[0]
        let target = files.system

        // Place in Subject and Session Folders
        split.forEach(a1 => {
            a1.forEach(name => {
                if (!target[name]) target[name] = {}
                target = target[name]
            })
        })

        // Place in File Modality Folder (if actually a modality)
        if (validModalities.includes(fileModality)){
            if (!target[fileModality]) target[fileModality] = {}
            target = target[fileModality]
        }

        target[fileName] = fileData
        delete files.system[fileName] // remove top-level file
    }

    return files
}