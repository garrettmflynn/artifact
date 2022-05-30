import * as encoders from './encoders/index.js'
import { getInfo } from './index.js'

export default async (name, o) => {
    const {mimeType, zipped} = getInfo({name})

    let buffer = ''
    if (mimeType && (mimeType.includes('image/') || mimeType.includes('video/'))) content = encoders.datauri(o)

    switch(mimeType){
        // case "text/comma-separated-values":
        //     return encoders.csv(o)
        case "text/tab-separated-values":
            buffer = encoders.tsv(o)
            break;
        case "application/json": 
            buffer =  encoders.json(o)
            break;
        case "application/x-nii": 
            buffer = encoders.nii(o)
            break;
        case "application/x-edf": 
            buffer = encoders.edf(o)
            break;
        default: 
            buffer = encoders.text(o)
            break;
    }

    if (zipped) buffer = await encoders.gzip(buffer)
    return buffer

}