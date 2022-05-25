import pako from 'pako'
import nifti from 'nifti-reader-js'

export default (buffer, mimeType) => {
    return new Promise((resolve, reject) => {
        try {

          if (mimeType !== "application/x-nii") resolve(pako.inflate(buffer))
          
          // Special nifti decompression
          else if (nifti.isCompressed(data)) resolve(nifti.decompress(data))
          
          // Catch decompressed nifti files
          else resolve(data)

        } catch (e) {
          return reject(false)
        }
      })
}