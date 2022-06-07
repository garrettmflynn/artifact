export default class KeyGroup {
    constructor (name) {

        this.name = name // 'acquisition-refaced_datatype-anat_suffix-T1w'
        this.groups = {} // The set of scans with identical metadata parameters contained in their sidecars

    }

    // The Parameter Group that contains the most scans in its Key Group
    getDominant = () => {
        let selected = [];
        Object.values(this.groups).forEach(arr => {
            if (arr.length > selected.length) selected = arr
        })
        return selected
    }

    add = (file) => {
        
        // Assign to a Parameter Group
        const id = 'this'
        if (!this.groups[id]) this.groups[id] = []
        this.groups[id].push(file)

        // const groupName = this.getGroup(file)
        
        // if (groupName == this.name) return this.assignParameterGroup(file)
        // else return false // Not supposed to be in this group
    }

    // Rename Variants to acq-VARIANTObliquity
    renameVariants = () => {
        const dominant = this.getDominant()
        Object.values(this.groups).forEach(arr => {
            if (arr != dominant) console.error('Must Rename!')
        })
    }
}