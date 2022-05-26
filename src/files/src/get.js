import { getInfo } from './index.js'
const defaultMethod = 'buffer'

const fileIgnore = ['.DS_Store']
const useRawArrayBuffer = ['nii', 'nwb']

export default (file) => {

    const { extension } = getInfo(file)

    return new Promise((resolve, reject) => {

        // ----------------- Ignore Arbitrary Files -----------------
        if (fileIgnore.includes(file.name)) reject(`Ignoring ${file.name} files`)

        // ----------------- Use Decoders -----------------
        else {
            const reader = new FileReader()
            const methods = {
                'dataurl': 'readAsDataURL',
                'buffer': 'readAsArrayBuffer'
            }

            let method = defaultMethod
            if (file.type && (file.type.includes('image/') || file.type.includes('video/'))) method = 'dataurl'
            
            reader.onloadend = e => {
                if (e.target.readyState == FileReader.DONE) {
                    if (!e.target.result) return reject(`No result returned using the ${method} method on ${file.name}`)

                    let data = e.target.result
                    if (data.length === 0) {
                        console.warn(`${file.name} appears to be empty`)
                        reject(false)
                    } else if (method === 'buffer' && !useRawArrayBuffer.includes(extension)) data = new Uint8Array(data) // Keep .nii files as raw ArrayBuffer
                    resolve({file, [method]: data})
                }
            }

            reader[methods[method]](file)
        }
    })
}