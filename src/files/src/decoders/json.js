import text from './text'
export default (o) => {
    if (!o.text) o.text = text(o)
    return JSON.parse(o.text)
}
