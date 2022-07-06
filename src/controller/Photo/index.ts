import { Response } from 'express'
import sharp from 'sharp'

import path from 'path'

import { selectArgsMinimized, User } from '@/models/User'

import { RequestExtended } from '@/types/Request'

export const allowedFormats = ['png', 'jpg']

export const updatePhoto = async (req: RequestExtended, res: Response) => {
  const format = req.query.format
  if (!allowedFormats.includes(format as string))
    return res.status(403).json({ message: 'Specify allowed format', type: 'warning' })
  const buffer = Buffer.from(req.body)
  if (!req.body || buffer.length < 1)
    return res.status(402).json({ message: 'No file received', type: 'warning' })
  const fileName = req.user.name + '.' + format
  const filePath = path.resolve(__dirname, '../../../uploads/', fileName)
  await sharp(buffer)
    .resize(460, 460)
    .toFile(filePath, (err) => {
      if (err) {
        console.log(err)
        throw new Error(err.message)
      }
    })
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { photo: fileName },
    { new: true },
  ).select(selectArgsMinimized)
  res.json({ message: 'Photo updated', type: 'success', payload: user })
}
