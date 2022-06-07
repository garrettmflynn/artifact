import * as files from 'freerange'
import * as tsv from 'freerange-tsv'
import * as nii from 'freerange-nii'
import * as edf from 'freerange-edf'
// import * as nwb from 'freerange-nwb'

const filemanager = new files.FileManager({
    debug: true,
    ignore: ['DS_Store']
})
filemanager.extend(tsv)
filemanager.extend(nii)
filemanager.extend(edf)
// filemanager.extend(nwb)

export default filemanager
