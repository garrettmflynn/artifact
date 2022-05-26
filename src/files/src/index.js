import decode from './decode.js'
import encode from './encode.js'
import getFileData from './get.js'

const types = {
    'csv': "text/comma-separated-values",
    'tsv': "text/tab-separated-values",
    'json': "application/json",
    'nii': "application/x-nii",
  }


  const getInfo = (file) => {
        let [name, ...extension] = file.name.split('.')
        // Swap file mimeType if zipped
        let mimeType = file.type        
        const zipped = (mimeType === "application/x-gzip")
        if (zipped) extension.pop() // Pop off .gz
        if (zipped || !mimeType) mimeType = types[extension]

        return {mimeType, zipped, extension: extension.join('.')}
  }


const get = async (file) => {
    const {mimeType, zipped} = getInfo(file)
    const data = await getFileData(file)
    return await decode(data, mimeType, zipped)
}


export {
    get,
    decode,
    encode,
    getInfo
}