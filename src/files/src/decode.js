import * as decoders from './decoders/index.js'
export default async (o, mimeType, zipped) => {


    if (zipped) o = await decoders.gzip(o, mimeType)
    if (mimeType && (mimeType.includes('image/') || mimeType.includes('video/'))) return o.dataurl

    switch(mimeType){
        // case "text/comma-separated-values":
        //     return decoders.csv(data)
        case "text/tab-separated-values":
            return decoders.tsv(o)
        case "application/json": 
            return decoders.json(o)
        case "application/x-nii": 
            return decoders.nii(o)
        case "application/x-nwb": 
            return decoders.nwb(o)
        case "application/x-edf": 
            return decoders.edf(o)
        case "application/xml": 
            return await decoders.xml(o)
        case "text/xml": // Alt. xml mimeType
            return await decoders.xml(o)
        default: 
            return decoders.text(o)
    }
}