import handlebars from 'handlebars'
import { createTransport } from 'nodemailer'

import fs from 'fs'
import path from 'path'

import CONFIG from '@/config'

export const sendMail = async (hash: string, email: string) => {
  const transporter = createTransport({
    host: 'smtp-mail.outlook.com', // hostname
    secure: false, // TLS requires secureConnection to be false
    port: 587, // port for secure SMTP
    tls: {
      ciphers: 'SSLv3',
    },
    auth: {
      user: CONFIG.MAIL.HOST,
      pass: CONFIG.MAIL.PASS,
    },
  })
  const html = fs.readFileSync(path.resolve(__dirname, '../../views', 'mail.hbs'), 'utf8')
  const template = handlebars.compile(html)
  const data = {
    link: CONFIG.MAIL.CONFIRM_PAGE_URL + 'users/confirm/' + hash,
  }
  const htmlToSend = template(data)
  const mail = {
    from: process.env.MAIL_USER,
    to: email,
    subject: 'Confirm email',
    //text: 'http://192.168.0.103:8000/users/confirm/' + hash,
    html: htmlToSend,
  }
  return await transporter.sendMail(mail)
}
