import { app } from './app'
import CONFIG from './config'
;(async () => {
  const port = process.env.PORT || 8000
  app.listen(port)
  process.stdout.write(`Application Environment: ${CONFIG.APP.ENV}\n`)
  process.stdout.write('Debug logs: ENABLED\n')
  process.stdout.write(`============ http://localhost:${CONFIG.APP.PORT} ===========\n`)
})()
