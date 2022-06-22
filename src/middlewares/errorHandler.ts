import { NextFunction, Request, Response } from 'express'

import HttpStatus from 'http-status'

/**
 * Error response middleware for 404 not found.
 * This middleware function should be at the very bottom of the stack.
 *
 * @param  {object}   req
 * @param  {object}   res
 */
export const notFoundError = (req: Request, res: Response, next: NextFunction) => {
  const NOT_FOUND_CODE = HttpStatus.NOT_FOUND
  res.status(NOT_FOUND_CODE).json({
    code: NOT_FOUND_CODE,
    message: HttpStatus[NOT_FOUND_CODE],
  })
}

/**
 * Generic error response middleware for validation and internal server errors.
 *
 *
 * @param {*} err
 * @param {Request} req
 * @param {Response} res
 */
export const genericErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  const dev = req.app.get('env') === 'dev'
  if (err.stack && dev) {
    console.log('Error stack trace: ', err.stack)
  }
  // render the error page
  res.status(err.status || 500).json({
    code: err.status || 500,
    message: err.status ? err.message : dev ? 'SERVER_ERROR: ' + err.message : 'Server Error ;(',
  })
}
