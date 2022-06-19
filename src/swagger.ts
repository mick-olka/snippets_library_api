import { Application } from 'express'
import swaggerJsDoc from 'swagger-jsdoc'
import swaggerUI, { SwaggerOptions } from 'swagger-ui-express'

import path from 'path'

import { paths } from '@/routes/Swagger'

export const initSwagger = (app: Application) => {
  const options = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'NETH API',
        version: '1.0.0',
        description: 'NETH API swagger',
      },
      servers: [{ url: `http://localhost:${process.env.PORT || 4000}` }],
      components: {
        securitySchemas: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
      security: [{ bearerAuth: [] }],
      paths,
    },
    apis: [path.resolve(__dirname, './routes/index.ts')],
  }

  const specs = swaggerJsDoc(options)
  app.use(
    '/api-docs',
    swaggerUI.serve,
    swaggerUI.setup(specs, { persistAuthorization: true } as SwaggerOptions),
  )
}
