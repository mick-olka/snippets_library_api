import YAML from 'yamljs'

import path from 'path'

// eslint-disable-next-line import/no-named-as-default-member
const all = YAML.load(path.resolve(__dirname, './paths.yaml'))
// eslint-disable-next-line import/no-named-as-default-member
const index = YAML.load(path.resolve(__dirname, './index.yaml'))
// eslint-disable-next-line import/no-named-as-default-member
const users = YAML.load(path.resolve(__dirname, './users.yaml'))

export const paths = Object.assign(all, index, users)
