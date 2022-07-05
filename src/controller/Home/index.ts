import { NextFunction, Request, Response } from 'express'

import * as homeService from '@/service/home'
import { catchAsync } from '@/utils/catchAsync'
import { sendMail } from '@/utils/sendMail'

export const getAppInfo = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const result = homeService.getAppInfo()
  res.status(200).json(result)
})

export const getMainPage = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  //
  res.render('index', { title: 'Main', arr: [1, 2, 4] })
})

export const sendMailR = async (req: Request, res: Response) => {
  const mail = req.params.mail
  await sendMail('hfueiwhfueiwhfueiw', mail)
  res.json({ message: 'Mail sent' })
}
