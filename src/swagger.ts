import { Application } from 'express'
import swaggerJsDoc from 'swagger-jsdoc'
import swaggerUI, { SwaggerOptions } from 'swagger-ui-express'

import path from 'path'

import { definition } from '@/routes/Swagger'

export const initSwagger = (app: Application) => {
  const options = {
    definition,
    apis: [path.resolve(__dirname, './routes/*/*.ts')],
  }

  const specs = swaggerJsDoc(options)
  app.use(
    '/api-docs',
    swaggerUI.serve,
    swaggerUI.setup(specs, { persistAuthorization: true } as SwaggerOptions),
  )
}
