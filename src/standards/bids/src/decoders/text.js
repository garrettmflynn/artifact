export default (buffer) => {
    return new TextDecoder().decode(buffer)
}