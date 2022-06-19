import { Request, Response } from 'express'

import { User } from '@/models/User'

export const createUser = async (req: Request, res: Response) => {
  if (!req.body) return res.status(400).json({ msg: 'No body sent' })
  const userData: { name: string; email: string; hash: string } = req.body
  const result = await User.create(userData)
  res.status(200).json({ result })
}

export const getUsers = async (req: Request, res: Response) => {
  const users = await User.find()
  res.status(200).json({ users })
}
