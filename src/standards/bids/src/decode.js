import * as decoders from './decoders/index.js'
export default async (data, mimeType, zipped) => {

    if (zipped) data = await decoders.gzip(data, mimeType)
    if (mimeType && mimeType.includes('image/') || mimeType.includes('video/')) return data

    switch(mimeType){
        case "text/tab-separated-values":
            return decoders.tsv(data)
        case "application/json": 
            return decoders.json(data)
        case "application/x-nii": 
            return decoders.nii(data)
        default: 
            return decoders.text(data)
    }
}