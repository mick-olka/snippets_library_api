import { NextFunction, Request, Response } from 'express'
import * as homeService from '@/service/home'
import { catchAsync } from '@/utils/catchAsync'

export const getAppInfo = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const result = homeService.getAppInfo()
  res.status(200).json(result)
})

export const getMainPage = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  //
  res.render('index', { title: 'Main', arr: [1, 2, 4] })
})
