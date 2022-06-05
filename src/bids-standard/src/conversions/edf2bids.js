import { keywords } from './index.js'
import bids2bids from './bids2bids.js'

const validModalities = ['eeg']

export default async (files) => {
    const firstPass = edf2bids(files)
    return await bids2bids(firstPass)
}


// Minimal BIDS Specification
const edf2bids = (files) => {
    let count = 0
    for (let fileName in files.system) {
        let nameRef = fileName
        const fileData = files.system[fileName]
        let split = fileName.split('_').map(str => str.split('-')).filter(arr => keywords.includes(arr[0]))
        let fileModality = fileName.split('_').at(-1).split('.')[0]
        if (!validModalities.includes(fileModality)) fileModality = 'eeg' // Default to inside the EEG folder

        let target = files.system

        // // Correct Non-BIDS Names
        if (split.length === 0 && fileName.includes('.edf')) {
            split = [['sub', fileName.replace('.edf', '')], ['ses', count]]
            nameRef = [['sub', fileName.replace('.edf', '').split('_')[1]], ['ses', count], ['eeg']].map(arr => arr.join('-')).join('_') + '.edf'
        }

        const isFullFile = nameRef.includes('.')

        // Place in Subject and Session Folders
        split.forEach(a1 => {
            a1.forEach(name => {
                if (!target[name]) target[name] = {}
                target = target[name]
            })
        })

        // Place in File Modality Folder (if actually a modality)
        
        if (isFullFile && validModalities.includes(fileModality)){
            if (!target[fileModality]) target[fileModality] = {}
            target = target[fileModality]
        }

        const isDifferent = !(target[nameRef] === fileData)
        target[nameRef] = fileData
        if (isDifferent) delete files.system[fileName] // remove top-level file
    }

    return files
}