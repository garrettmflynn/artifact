import decode from './decode.js'
import encode from './encode.js'
import getFileData from './get.js'
import IterativeFile from './IterativeFile.js'
import lookup from './lookup.js'


  const getInfo = (file) => {
        let [name, ...extension] = file.name.split('.')
        // Swap file mimeType if zipped
        let mimeType = file.type    
        const zipped = (mimeType === lookup['gz'] || extension.includes('gz'))
        if (zipped) extension.pop() // Pop off .gz
        if (zipped || !mimeType) mimeType = lookup[extension[0]]
        return {mimeType, zipped, extension: extension.join('.')}
  }


const get = async (file) => {
    const iterativeFile = new IterativeFile(file)
    await iterativeFile.init()
    return iterativeFile
}


export {
    get,
    lookup,
    decode,
    encode,
    getInfo,
    getFileData,
    IterativeFile
}