import YAML from 'yamljs'

import path from 'path'

// eslint-disable-next-line import/no-named-as-default-member
const all = YAML.load(path.resolve(__dirname, './paths.yaml'))
// eslint-disable-next-line import/no-named-as-default-member
const index = YAML.load(path.resolve(__dirname, './index.yaml'))
// eslint-disable-next-line import/no-named-as-default-member
const users = YAML.load(path.resolve(__dirname, './users.yaml'))

export const paths = Object.assign(all, index, users)

export const definition = {
  openapi: '3.0.0',
  info: {
    description: 'Library API',
    version: '1.0.0',
    title: 'Library API',
  },
  basePath: '/',
  servers: [
    { url: `http://localhost:${process.env.PORT || 4000}` },
    { url: `http://192.168.0.103:${process.env.PORT || 4000}` },
  ],
  tags: [
    {
      name: 'user',
      description: 'Operations about user',
    },
  ],
  schemes: ['https', 'http'],
  paths,
  components: {
    schemas: {
      User: {
        type: 'object',
        properties: {
          _id: {
            type: 'string',
          },
          name: {
            type: 'string',
          },
          email: {
            type: 'string',
          },
          pass: {
            type: 'string',
          },
        },
        example: {
          name: 'fgfd',
        },
        xml: {
          name: 'User',
        },
      },
      ApiResponse: {
        type: 'object',
        properties: {
          type: {
            type: 'string',
            enum: ['error', 'warning', 'success'],
          },
          message: {
            type: 'string',
          },
        },
      },
    },
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
  securityDefinitions: {
    petstore_auth: {
      type: 'oauth2',
      authorizationUrl: 'http://petstore.swagger.io/oauth/dialog',
      flow: 'implicit',
      scopes: {
        'write:pets': 'modify pets in your account',
        'read:pets': 'read your pets',
      },
    },
    api_key: {
      type: 'apiKey',
      name: 'api_key',
      in: 'header',
    },
  },
  definitions: {
    User: {
      type: 'object',
      properties: {
        _id: {
          type: 'string',
        },
        name: {
          type: 'string',
        },
        email: {
          type: 'string',
        },
        pass: {
          type: 'string',
        },
      },
      xml: {
        name: 'User',
      },
    },
  },
}
