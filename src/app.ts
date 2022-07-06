import cookieParser from 'cookie-parser'
import cors from 'cors'
import { config } from 'dotenv'
import express, { json, static as express_static, urlencoded } from 'express'
import bodyParser from 'express'
import mongoose from 'mongoose'
import morgan from 'morgan'
import sassMiddleware from 'node-sass-middleware'

import path from 'path'
import process from 'process'

import { postsRouter } from './routes/Post/index'
import { usersRouter } from './routes/User/index'

import * as errorHandler from '@/middlewares/ErrorHandler'
import home from '@/routes/Home'
import { initSwagger } from '@/swagger'

const whitelist = [
  'http://localhost:3000',
  'http://localhost:4000',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:4000',
  'http://192.168.0.103:3000',
  'http://192.168.0.103:4000',
  'https://srenik.pp.ua',
  'http://srenik.pp.ua',
]
const options: cors.CorsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin!) !== -1 || !origin) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
}

export const app = express()
config() //  .env activation
//  DB connect
if (process.env.DBURL) {
  mongoose.connect(process.env.DBURL, {}, (err) => {
    if (err) console.log(err)
    else console.log('connected')
  })
} else console.log('Add DBURL to .env !')
// view engine setup
app.set('views', path.join(__dirname, '../views'))
app.set('view engine', 'hbs')
app.set('env', process.env.NODE_ENV)
app.set('jwtTokenSecret', process.env.JWT_SECRET)
// other
app.use(cookieParser())
app.use(
  sassMiddleware({
    src: path.join(__dirname, '../public'),
    dest: path.join(__dirname, '../public'),
    indentedSyntax: false, // true = .sass and false = .scss
    sourceMap: true,
  }),
)
app.use(express_static(path.join(__dirname, '../public')))
app.use('/uploads', express_static(path.join(__dirname, '../uploads')))
app.use(cors(options))
const rawOptions = {
  inflate: true,
  limit: '5000kb',
  type: ['image/jpeg', 'image/png'],
}
app.use(bodyParser.raw(rawOptions))
app.use(morgan('dev')) //  logging
//  expects request data to be sent in JSON format, which often resembles a simple JS object
app.use(json())
//  expects request data to be sent encoded in the URL, usually in strings or arrays
app.use(urlencoded({ extended: true }))
// API Routes
app.use('/api/', home)
app.use('/api/users', usersRouter)
app.use('/api/posts', postsRouter)
initSwagger(app)
// Error Middleware
app.use(errorHandler.genericErrorHandler)
app.use(errorHandler.notFoundError)
