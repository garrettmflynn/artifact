import xml2js from 'xml2js'
import text from './text.js'

export default async (o) => {
    if (!o.text) o.text = text(o)
    return await xml2js.parseStringPromise(o.text, { explicitCharkey: true })
}