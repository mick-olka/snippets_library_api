import { createTransport } from 'nodemailer'

export const sendMail = async (hash: string, email: string) => {
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
    to: email,
    subject: 'Confirm email',
    text: 'http://192.168.0.103:8000/users/confirm/' + hash,
  }
  return await transporter.sendMail(mail)
}
