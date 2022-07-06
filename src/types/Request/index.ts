import { Request } from 'express'

import { UserI } from '../interfaces'

export interface RequestExtended extends Request {
  user: UserI
}
