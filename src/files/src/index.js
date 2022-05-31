import decode from './decode.js'
import encode from './encode.js'
import getFileData from './get.js'

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
    const {mimeType, zipped} = getInfo(file)
    const data = await getFileData(file).catch(e => console.error(e))
    if (data) return await decode(data, mimeType, zipped).catch(e => console.error(e))
    else return null
}


export {
    get,
    decode,
    encode,
    getInfo
}