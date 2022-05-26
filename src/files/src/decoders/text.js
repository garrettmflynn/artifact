export default (o) => {
    return new TextDecoder().decode(o.buffer)
}