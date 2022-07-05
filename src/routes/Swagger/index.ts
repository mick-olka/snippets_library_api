import YAML from 'yamljs'

import path from 'path'

const all = YAML.load(path.resolve(__dirname, './paths.yaml'))
const index = YAML.load(path.resolve(__dirname, './index.yaml'))
const users = YAML.load(path.resolve(__dirname, './users.yaml'))
const posts = YAML.load(path.resolve(__dirname, './posts.yaml'))

export const paths = Object.assign(all, index, users, posts)

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
    { url: `https://srenik.pp.ua` },
  ],
  tags: [
    {
      name: 'user',
      description: 'Operations about user',
    },
  ],
  paths,
  components: {
    schemas: {
      User: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          name: { type: 'string' },
          email: { type: 'string' },
          about: { type: 'string' },
          password: { type: 'string' },
          posts: { type: 'array', items: { type: 'string' }, description: 'posts ids' },
        },
        xml: { name: 'User' },
      },
      Post: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          author: { type: 'string' },
          title: { type: 'string' },
          subtitle: { type: 'string' },
          text: { type: 'string' },
          public: { type: 'boolean' },
          upvoters: { type: 'array', items: { type: 'string' } },
          downvoters: { type: 'array', items: { type: 'string' } },
        },
        xml: { name: 'Post' },
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
}
