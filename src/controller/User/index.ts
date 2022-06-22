import { Request, Response } from 'express'

import { randomBytes } from 'crypto'

import { User } from '@/models/User'
import { UserI } from '@/types/interfaces'
import { sendMail } from '@/utils/sendMail'

interface PotentialUser {
  name: string
  email: string
  pass: string
  hash: string
}

let potentialUsers: PotentialUser[] = []

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

export const register = async (req: Request, res: Response) => {
  const { name, email, pass } = req.body
  if (!name || !email || !pass) throw new Error('Invalid credentials') //  not res to log for dev mode
  const alreadyPotential = potentialUsers.find((u) => u.email == email)
  if (alreadyPotential)
    return res.status(202).json({ message: 'Check your email or look for confirm letter' })
  const existing = await User.findOne({ $or: [{ name: name }, { email: email }] })
  if (existing) {
    return res.status(409).json({ message: 'User with such name or email already exists' })
  }
  const hash = randomBytes(32).toString('hex')
  potentialUsers.push({ name, email, pass, hash })
  sendMail(hash, email)
  res.json({ message: 'Confirm user via email' })
}

export const confirmEmail = async (req: Request, res: Response) => {
  const hash = req.params.hash
  const potential = potentialUsers.find((u) => u.hash == hash)
  if (potential) {
    potentialUsers = potentialUsers.filter((u) => u.hash !== hash)
    const userData: UserI = potential
    await User.create(userData)
    res.json({ msg: 'user confirmed', token: 'generatedtoken' })
  } else res.json({ msg: 'no such user in potential' })
}
