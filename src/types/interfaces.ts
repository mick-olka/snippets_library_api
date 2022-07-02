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
  about: string
  pass: string
  posts: string[]
}

export interface PostI {
  _id: string
  title: string
  subtitle: string
  text: string
  author: string
  public: boolean
}
export interface RequestExtended extends Request {
  user: { id: string; exp: string }
}
