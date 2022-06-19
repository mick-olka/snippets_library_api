import { NextFunction, Response, Request } from 'express'

export const catchAsync = (fn: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next)
  }
}
