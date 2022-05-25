import * as encoders from './encoders'

export default async (o, mimeType) => {

    // if (zipped) buffer = await decoders.gzip(buffer)

    if (mimeType && (mimeType.includes('image/') || mimeType.includes('video/'))) return encoders.datauri(o)


    switch(mimeType){
        case "text/tab-separated-values":
            return encoders.tsv(o)
        case "application/json": 
            return encoders.json(o)
        case "application/x-nii": 
            return encoders.nii(o)
        default: 
            return encoders.text(o)
    }
}