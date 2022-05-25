export default async (object, mimeType, zipped) => {

    // if (zipped) buffer = await decoders.gzip(buffer)

    // switch(mimeType){
    //     case "text/tab-separated-values":
    //         return decoders.tsv(buffer)
    //     case "application/json": 
    //         return decoders.json(buffer)
    //     case "application/x-nii": 
    //         return decoders.nifti(buffer)
    //     default: 
    //         return false
    // }

    console.warn('Encode is not implemented yet...')
    return object
}