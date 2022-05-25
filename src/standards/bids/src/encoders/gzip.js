import pako from 'pako'

export default (o) => {
    return pako.deflate(o);
}