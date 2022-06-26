import { Request } from 'express'

export interface UserI {
  name: string
  email: string
  pass: string
}

export interface RequestExtended extends Request {
  user: any
}
