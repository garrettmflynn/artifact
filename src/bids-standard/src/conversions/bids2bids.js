// import { keywords } from './index.js'
import * as templates from '../templates.js'
import fileManager from '../files.js'

const required = ['README', 'participants.json', 'participants.tsv', 'dataset_description.json']
const topLevel = ['CHANGES', '.bidsignore', ...required]
// const validModalities = ['eeg']


const getFileParts = (name) => {
    const fileParts = {}
    const splitFile = name.split('_').map(str => str.split('-'))
    splitFile.forEach(arr => {
        if (arr[1]) fileParts[arr[0]] = arr[1]
        else {
            const split = arr[0].split('.')
            fileParts.extension = split[1]
            fileParts.modality = split[0]
        }
    })
    return fileParts
}

const moveFiles = (key, parent) => {

    // Check Each Entry in Parent
    const collection = {} ?? parent[key]
    for (let key1 in parent){
        const val = parent[key1]
        const parts = getFileParts(key1)
        if (parts[key]) {
            collection[parts[key]] = val
            delete parent[key1] // Delete from parent
        }
    }

    // Only Move if Enough Entries Found
    if (Object.keys(collection).length) {
        parent[key] = collection
        return parent[key]
    } else {
        console.warn(`Only one ${key} recognized in this directory!`)
        return parent
    }
}

// Convert BIDS-Formatted Directories to Valid Structure
export default async (files, options) => {


    // Get Subject Folder
    let newParent = moveFiles('sub', files.system)
    newParent = moveFiles('ses', newParent)

    // Add Required Top-Level Files
    await Promise.allSettled(required.map(async name => {
        if (!files.system[name]){
            const fileSpoof = {
                name
            }
            const ext = name.split('.').slice(1).join('.')
            if (templates.files[name]) fileSpoof.data = templates.files[name]
            else if (ext === 'json') fileSpoof.data = {}
            else if (ext === 'tsv') fileSpoof.data = []
            else fileSpoof.data = ''

             await fileManager.loadFile(fileSpoof) // Add to root
        }
    }))
    
    // Rename directory names in alignment with files
    // Overwrite directory with filename
    const toDelete = []
    for (let subjectName in files.system.sub) {
        const sessions = Object.assign({}, files.system.sub[subjectName].ses ?? {})
        for (let sessionName in sessions){
            const sessionBase = sessions[sessionName]
            const info = {subjectName, sessionName, base: files.system}
            const agnosticToDelete =  renameFileEntries(sessionBase, info) // Grab modality-agnostic files
            toDelete.push(agnosticToDelete)
            Object.values(sessionBase).forEach(modalityBase => {
                const specificToDelete = renameFileEntries(modalityBase, info) // Grab modality-specific files
                toDelete.push(specificToDelete)
            })
        }
    }

    // Delete Extraneous Subject / Session Names
    toDelete.forEach(o => {

        // Delete Sessions
        o.sessions.forEach(([sub, ses]) => {
            delete files.system.sub[sub].ses[ses]
        })

        // Delete Subjects
        o.subjects.forEach(name => {
            delete files.system.sub[name]
        })
    })

    // Populate empty participants.tsv file
    const participants = await files.system['participants.tsv'].get()
    if (participants.length === 0){
        Object.keys(files.system.sub).forEach(key => {
            const participantTemplate = JSON.parse(JSON.stringify(templates.objects['participants.tsv']))
            participantTemplate.participant_id =  `sub-${key}`
            participants.push(participantTemplate)
        })
    }
    
    return files
}


const renameFileEntries = (baseDir, info) => {
    const subsToDelete = new Set()
    const sessionsToDelete = new Set()

    Object.entries(baseDir).filter(arr => arr[0].split('.').length > 1).forEach(([firstKey, firstValue]) => {
        const fileNameStructure = {}
        const split = firstKey.split('_')
        const extraSlice = split.filter(str => !['sub', 'ses'].includes(str.split('-')[0]))
        split.map(str => str.split('-')).forEach(arr => fileNameStructure[arr[0]] = arr[1])
        if (!fileNameStructure.sub) fileNameStructure.sub = info.subjectName
        // if (!fileNameStructure.ses) fileNameStructure.ses = info.sessionName

        // Update in Directory
        if (fileNameStructure.sub != info.subjectName) {
            info.base.sub[fileNameStructure.sub] = info.base.sub[info.subjectName]
            subsToDelete.add(info.subjectName)
        }

        // if (fileNameStructure.ses != info.sessionName) {
        //     info.base.sub[fileNameStructure.sub].ses[fileNameStructure.ses] = info.base.sub[info.subjectName].ses[info.sessionName]
        //     sessionsToDelete.add([info.subjectName, info.sessionName])
        // }

        // Update in File Name
        const updatedKey = `sub-${fileNameStructure.sub}_${extraSlice.join('_')}`
        // const updatedKey = `sub-${fileNameStructure.sub}_ses-${fileNameStructure.ses}_${extraSlice.join('_')}`
        if (updatedKey != firstKey){
            baseDir[updatedKey] = firstValue
            delete baseDir[firstKey]
        }
    })

    return {
        subjects: subsToDelete,
        sessions: sessionsToDelete
    }
}