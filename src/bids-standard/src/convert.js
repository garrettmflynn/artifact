import * as conversions from './conversions/index.js'
export default async (files, method, options) => {
    if (method && conversions[method] instanceof Function) return await conversions[method](files, options)
    else return files
}