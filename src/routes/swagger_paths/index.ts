import YAML from 'yamljs'
import path from 'path'

const all = YAML.load(path.resolve(__dirname, './paths.yaml'))
const index = YAML.load(path.resolve(__dirname, './index.yaml'))

export const paths = Object.assign(all, index)
