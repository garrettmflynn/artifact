import pako from 'pako'

export default (o) => {
    return new Promise((resolve, reject) => {
        try {
            o.buffer = pako.inflate(o.buffer).buffer
            resolve(o)
        } catch (e) {
          console.error(e)
          return reject(false)
        }
      })
}