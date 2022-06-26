import { Request } from 'express'

export interface UserRegistrationI {
  name: string
  email: string
  hash: string
  pass: string
}

export interface UserI {
  _id: string
  name: string
  email: string
  pass: string
  posts: string[]
}

export interface PostI {
  _id: string
  title: string
  subtitle: string
  text: string
  author: string
}
export interface RequestExtended extends Request {
  user: any
}
