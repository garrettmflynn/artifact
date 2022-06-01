// import { keywords } from './index.js'
import * as templates from '../templates.js'
import { IterativeFile } from 'src/files/src/index.js'

const required = ['README', 'participants.json', 'participants.tsv', 'dataset_description.json']
const topLevel = ['CHANGES', '.bidsignore', ...required]
// const validModalities = ['eeg']

// Convert BIDS-Formatted Directories to Valid Structure
export default async (files, options) => {

    const subjects = Object.values(files.system.sub ?? {})
    const hasSubjects = subjects && subjects.length > 0 // Top-level only
    let sessions = Object.values(files.system.ses ?? {}) 
    if (sessions.length === 0) sessions = subjects.map(o => o.ses).filter(val => !!val) // Top-level or nested in subject folders
    const hasSessions = true // sessions && sessions.length > 0 // Doesn't matter if there are no sessions

    const originalFiles = files.system
    files.system = {sub: {}}

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
            files.system[name] = new IterativeFile(fileSpoof, options)
            await files.system[name].init()

            const key = ext || name
            if (!files.types[key]) files.types[key] = {}
            files.types[key][name.replace(`.ext`, '')] = files.system[name] // Link in types references
        }
    }))
    
    if (!(hasSubjects && hasSessions)){

        // Lock Top-Level Directories
        topLevel.forEach(k => {
            if (k in originalFiles) {
                files.system[k] = originalFiles[k]
                delete originalFiles[k]
            }
        })

        // Nest Directories 
        if (!hasSubjects && !hasSessions) {
            files.system.sub = {'01': {ses: {'1':originalFiles}}}
        } else if (!hasSubjects && hasSessions) files.system.sub = {'01': originalFiles}
        else if (hasSubjects && !hasSessions) {
            Object.entries(originalFiles.sub).map(([key, value]) => {
                files.system.sub[key] = {ses:{
                    '1': value
                }}
            })
        }
    } else Object.assign(files.system, originalFiles) // Don't lose top-level files


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