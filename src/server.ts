import * as express from 'express'

import { Server, createServer } from 'http'

import CONFIG from './config'

export const startServer = (app: express.Application): Server => {
  const httpServer = createServer(app)

  return httpServer.listen({ port: CONFIG.APP.PORT }, (): void => {
    process.stdout.write(`Application Environment: ${CONFIG.APP.ENV}\n`)
    process.stdout.write('Debug logs: ENABLED\n')
    process.stdout.write(`============ http://localhost:${CONFIG.APP.PORT} ===========\n`)
  })
}
