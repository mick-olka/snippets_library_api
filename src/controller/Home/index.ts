import { NextFunction, Request, Response } from 'express'

import { createTransport } from 'nodemailer'

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

export const sendMail = async (req: Request, res: Response) => {
  const transporter = createTransport({
    host: 'smtp-mail.outlook.com', // hostname
    secure: false, // TLS requires secureConnection to be false
    port: 587, // port for secure SMTP
    tls: {
      ciphers: 'SSLv3',
    },
    auth: {
      user: 'srenik_brek@outlook.com',
      pass: '7m7RXC2dKTE2DjE',
    },
  })
  const mail = {
    from: 'srenik_brek@outlook.com',
    to: 'pavelbin29@gmail.com',
    subject: 'Test',
    text: 'test message',
  }
  transporter.sendMail(mail, (err, info) => {
    if (err) {
      console.log(err)
    } else {
      console.log(info.response)
    }
  })
  res.json({ message: 'Mail sent' })
}
