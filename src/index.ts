// ! Don't convert require into import
// tslint:disable-next-line: no-var-requires
require('module-alias/register')
// tslint:disable-next-line: no-var-requires
const moduleAlias = require('module-alias')

moduleAlias.addAlias('@', __dirname)
// tslint:disable-next-line: no-var-requires
const { createApp } = require('./app')
// tslint:disable-next-line: no-var-requires
const { startServer } = require('./server')

if (process.env.NODE_ENV !== 'test') {
  const app = createApp()
  startServer(app)
}
