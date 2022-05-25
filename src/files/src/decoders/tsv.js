
const stripBOM = str => str.replace(/^\uFEFF/, '')
const normalizeEOL = str => str.replace(/\r\n/g, '\n').replace(/\r/g, '\n')
const isContentfulRow = row => row && !/^\s*$/.test(row)
import text from './text'

export default (buffer) => {
    let contents = text(buffer)
    const collection = []
    contents = stripBOM(contents)
    const rows = normalizeEOL(contents).split('\n').filter(isContentfulRow).map(str => str.split('\t'))
    const headers = rows.length ? rows.splice(0, 1)[0] : []

    rows.forEach((arr, i) => {
        const o = {}
        arr.forEach((val, j) =>o[headers[j]] = val)
        collection.push(o)
    })
    return collection
}