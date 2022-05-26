import text from './text'
export default (o) => {
    const textContent = text(o)
    return JSON.parse(textContent)
}
