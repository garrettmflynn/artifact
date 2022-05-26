import pako from 'pako'
import nifti from 'nifti-reader-js'

export default (o, mimeType) => {
    return new Promise((resolve, reject) => {
        try {

          if (mimeType !== "application/x-nii") {
            o.buffer = pako.inflate(o.buffer)
            resolve(o)
          }
          
          // Special nifti decompression
          else {
            const isCompressed = nifti.isCompressed(o.buffer)
            if (isCompressed) {
              o.buffer = nifti.decompress(o.buffer)
              resolve(o)
            }
          
            // Catch decompressed nifti files
            else resolve(o)
          }

        } catch (e) {
          console.error(e)
          return reject(false)
        }
      })
}