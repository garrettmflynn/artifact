import yaml from 'yaml'
export default (o) => {
    return yaml.stringify(o)
}