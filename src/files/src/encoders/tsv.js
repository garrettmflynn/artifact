import textEncoder from './text.js'

const addBOM = str => `\ufeff${str}`//.replace(/^\uFEFF/, '') // TODO

export default (arr) => {
    const rows = (arr.length) ? [Object.keys(arr[0]), ...arr.map(o => Object.values(o))] : []
    let text = rows.map(row => row.join('\t')).join('\n')
    text = addBOM(text)
    return textEncoder(text)
}