import decode from './decode.js'
import encode from './encode.js'
import getFileData from './get.js'
import IterativeFile from './IterativeFile.js'

const types = {
    'gz': "application/x-gzip",
    'csv': "text/comma-separated-values",
    'tsv': "text/tab-separated-values",
    'json': "application/json",
    'nii': "application/x-nii",
    'edf': "application/x-edf",
    'nwb': "application/x-nwb",
  }


  const getInfo = (file) => {
        let [name, ...extension] = file.name.split('.')
        // Swap file mimeType if zipped
        let mimeType = file.type    
        const zipped = (mimeType === types['gz'] || extension.includes('gz'))
        if (zipped) extension.pop() // Pop off .gz
        if (zipped || !mimeType) mimeType = types[extension[0]]
        return {mimeType, zipped, extension: extension.join('.')}
  }


const get = async (file) => {
    const iterativeFile = new IterativeFile(file)
    await iterativeFile.init()
    return iterativeFile
}


export {
    get,
    decode,
    encode,
    getInfo,
    getFileData,
    IterativeFile
}