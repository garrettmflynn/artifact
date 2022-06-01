import yaml from 'yaml'
import text from './text.js'
export default (o) => {
    return text(yaml.stringify(o))
}