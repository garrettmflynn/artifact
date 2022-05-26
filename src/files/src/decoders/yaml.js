import yaml from 'yaml'
export default (o, isText=false) => {
    const textContent = (!isText) ? text(o) : o
    return yaml.parse(textContent)
}
