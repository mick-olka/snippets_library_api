import { Request, Response } from 'express'

// import { sign } from 'jsonwebtoken'

// import moment from 'moment'

// import { randomBytes } from 'crypto'

import { Post } from '@/models/Post'
import { RequestExtended } from '@/types/interfaces'
// import { RequestExtended, UserI } from '@/types/interfaces'
// import * as crypt from '@/utils/crypt'
// import { sendMail } from '@/utils/sendMail'

// interface PotentialUser {
//   name: string
//   email: string
//   pass: string
//   hash: string
// }

// let potentialUsers: PotentialUser[] = []

export const createPost = async (req: RequestExtended, res: Response) => {
  if (!req.body) throw new Error('Body is empty')
  if (!req.user) throw new Error('Need to login')
  const postData = req.body
  if (!postData.title)
    return res.status(402).json({ type: 'warning', message: 'Please provide a title' })
  postData.author = req.user.id
  const result = await Post.create(postData)
  res.status(200).json({ message: 'Post created', type: 'success', payload: result })
}

export const getPosts = async (req: Request, res: Response) => {
  const posts = await Post.find()
  res.status(200).json({ message: 'Posts received', type: 'success', payload: posts })
}

// export const updateUser = async (req: RequestExtended, res: Response) => {
//   if (!req.body) throw new Error('Body is empty')
//   if (!req.user) throw new Error('User is not verified')
//   if (req.body.email) throw Error("Can't update email")
//   if (req.body.pass) req.body.pass = await crypt.hash(req.body.pass)
//   const result = await User.findByIdAndUpdate(req.user.id, req.body, { new: true })
//   res.status(200).json({ message: 'User updated', type: 'success', payload: result })
// }

// export const register = async (req: Request, res: Response) => {
//   const { name, email, pass } = req.body
//   if (!name || !email || !pass) throw new Error('Invalid credentials: name & email & pass needed') //  not res to log for dev mode
//   const alreadyPotential = potentialUsers.find((u) => u.email == email)
//   if (alreadyPotential)
//     return res
//       .status(202)
//       .json({ message: 'Check your email or look for confirm letter', type: 'success' })
//   const existing = await User.findOne({ $or: [{ name: name }, { email: email }] })
//   if (existing) {
//     return res
//       .status(409)
//       .json({ message: 'User with such name or email already exists', type: 'warning' })
//   }
//   const hash = randomBytes(32).toString('hex')
//   potentialUsers.push({ name, email, pass, hash })
//   setTimeout(() => {
//     potentialUsers = potentialUsers.filter((u) => u.hash !== hash)
//   }, 1000 * 60 * 5) // delete after 5 min
//   sendMail(hash, email)
//   res.json({
//     message: 'Confirm user via email',
//     type: 'success',
//     payload: 'Confirmation was sent on ' + email,
//   })
// }

// export const login = async (req: Request, res: Response) => {
//   const { login, pass } = req.body
//   if (!login || !pass)
//     return res
//       .status(401)
//       .json({ message: 'Invalid Credentials: login & pass needed', type: 'warning' })
//   const user = await User.findOne({ $or: [{ name: login }, { email: login }] })
//   if (!user) {
//     return res.status(404).json({ message: 'No user with such credentials', type: 'warning' })
//   }
//   const success = await crypt.compare(pass, user.pass)
//   if (!success)
//     return res.status(401).json({ message: 'Credentials: invalid login or pass', type: 'error' })
//   const expires = moment().add(2, 'days').valueOf()
//   const token = sign(
//     {
//       id: user._id,
//       exp: expires,
//     },
//     req.app.settings.jwtTokenSecret,
//   )
//   res.json({
//     message: 'user confirmed',
//     payload: { token, expires: moment(expires) },
//     type: 'success',
//   })
// }

// export const confirmEmail = async (req: Request, res: Response) => {
//   const hash = req.params.hash
//   const potential = potentialUsers.find((u) => u.hash == hash)
//   if (potential) {
//     potentialUsers = potentialUsers.filter((u) => u.hash !== hash)
//     const userData: UserI = potential
//     userData.pass = await crypt.hash(userData.pass)
//     const user = await User.create(userData)
//     const expires = moment().add(2, 'days').valueOf()
//     const token = sign(
//       {
//         id: user._id,
//         exp: expires,
//       },
//       req.app.settings.jwtTokenSecret,
//     )
//     res.json({
//       message: 'user confirmed',
//       payload: { token, expires: moment(expires) },
//       type: 'success',
//     })
//   } else res.status(404).json({ message: 'Account already confirmed', type: 'error' })
// }
