import { Request, Response } from 'express'

import HttpStatus from 'http-status'

import * as errors from '@/utils/error'

/**
 * Error response middleware for 404 not found.
 * This middleware function should be at the very bottom of the stack.
 *
 * @param  {object}   req
 * @param  {object}   res
 */
export const notFoundError = (req: Request, res: Response) => {
  const NOT_FOUND_CODE = HttpStatus.NOT_FOUND
  res.status(NOT_FOUND_CODE).json({
    error: {
      code: NOT_FOUND_CODE,
      message: HttpStatus[NOT_FOUND_CODE],
    },
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
export const genericErrorHandler = (err: any, req: Request, res: Response) => {
  if (err.stack) {
    process.stdout.write('Error stack trace: ', err.stack)
  }

  const error = errors.buildError(err)
  res.status(error.code).json({ error })
}
