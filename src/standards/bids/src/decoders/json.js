import text from './text'
export default (buffer) => {
    const textContent = text(buffer)
    return JSON.parse(textContent)
}
