const defaultMethod = 'readAsArrayBuffer'

export const getFileData = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()

        let method = defaultMethod
        if (file.type && (file.type.includes('image/') || file.type.includes('video/'))) method = 'readAsDataURL'
        
        reader.onloadend = e => {
            if (e.target.readyState == FileReader.DONE) {
                if (!e.target.result) return reject(false)

                let data;
                if (method === defaultMethod) {
                    const data = new Uint8Array(e.target.result)
                    if (data.length === 0) {
                        console.warn(`${file.name} appears to be empty`)
                        reject(false)
                    }
                } else data = e.target.result
                resolve(data)
            }
        }

        reader[method](file)
    })
}
