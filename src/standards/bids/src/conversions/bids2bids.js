// import { keywords } from './index.js'

const topLevel = ['README', 'CHANGES', '.bidsignore', 'participants.tsv']
// const validModalities = ['eeg']

// Convert BIDS-Formatted Directories to Valid Structure
export default (files) => {

    const subjects = Object.values(files.system.sub ?? {})
    const hasSubjects = subjects && subjects.length > 0 // Top-level only
    let sessions = Object.values(files.system.ses ?? {}) 
    if (sessions.length === 0) sessions = subjects.map(o => o.ses).filter(val => !!val) // Top-level or nested in subject folders
    const hasSessions = sessions && sessions.length > 0

    const originalFiles = files.system
    files.system = {}
    
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
            files.system.sub = {0: {ses: {0:originalFiles}}}
        } else if (!hasSubjects && hasSessions) files.system.sub = {0: originalFiles}
        else if (hasSubjects && !hasSessions) {
            Object.entries(originalFiles.sub).map(([key, value]) => {
                files.system.sub[key] = {
                    0: value
                }
            })
        }
    } else files.system = originalFiles
    
    return files
}