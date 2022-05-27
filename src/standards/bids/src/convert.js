import * as conversions from './conversions/index.js'
export default (files, method) => {
    if (method && conversions[method] instanceof Function) return conversions[method](files)
    else return files
}