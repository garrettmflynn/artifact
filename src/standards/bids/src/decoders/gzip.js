import pako from 'pako'
import nifti from 'nifti-reader-js'

export default (buffer, mimeType) => {
    return new Promise((resolve, reject) => {
        try {

          if (mimeType !== "application/x-nii") resolve(pako.inflate(buffer))
          
          // Special nifti decompression
          else {

            const isCompressed = nifti.isCompressed(buffer)
            if (isCompressed) resolve(nifti.decompress(buffer))
          
            // Catch decompressed nifti files
            else resolve(buffer)
          }

        } catch (e) {
          console.error(e)
          return reject(false)
        }
      })
}