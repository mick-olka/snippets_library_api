import { Request, Response } from 'express'
import { sign } from 'jsonwebtoken'
import moment from 'moment'

import { randomBytes } from 'crypto'

import { selectArgsMinimized, selectUserWithoutPosts, User } from '@/models/User'
import { UserI, UserRegistrationI } from '@/types/interfaces'
import { RequestExtended } from '@/types/Request'
import * as crypt from '@/utils/crypt'
import { nullifyString } from '@/utils/filter'
import { getQueryPageAndLimit } from '@/utils/object'
import { sendMail } from '@/utils/sendMail'

interface PotentialUser {
  alias: string
  email: string
  password: string
  hash: string
}

let potentialUsers: PotentialUser[] = []

export const createUser = async (req: Request, res: Response) => {
  if (!req.body) throw new Error('Body is empty')
  const userData: { alias: string; email: string; hash: string } = req.body
  const result = await User.create(userData)
  res.status(200).json({ message: 'User created', type: 'success', payload: result })
}

export const getUsers = async (req: Request, res: Response) => {
  const { limit = 100, page = 1, regexp } = getQueryPageAndLimit(req.query)
  const reg = nullifyString(regexp as string)
  const filter: any = {}
  if (reg)
    filter.$or = [
      { alias: { $regex: reg, $options: 'i' } },
      { name: { $regex: reg, $options: 'i' } },
      { email: { $regex: reg, $options: 'i' } },
    ]
  const users = await User.paginate(filter, {
    limit: +limit,
    page: +page,
    select: selectArgsMinimized,
  })
  res.status(200).json({ message: 'Users received', type: 'success', payload: users })
}

export const getUserDetails = async (req: RequestExtended, res: Response) => {
  const userId = req.params.id
  if (!userId) return res.status(404).json({ message: 'No id specified', type: 'warning' })
  const user = await User.findById(userId)
  if (!user) return res.status(404).json({ message: 'User not Found', type: 'warning' })
  user.totalPosts = user.posts.length
  user.totalSaves = user.saves.length
  delete user.posts
  delete user.saves
  res.json({ message: 'User received', type: 'success', payload: user })
}

export const getUserPosts = async (req: RequestExtended, res: Response) => {
  const { page = 1, limit = 1000, tags, regexp } = getQueryPageAndLimit(req.query)
  let tagsFilter = nullifyString(tags as string)
  const reg = nullifyString(regexp as string)
  const match: any = {}
  const userId = req.params.id
  if (!userId) return res.status(404).json({ message: 'No id specified', type: 'warning' })
  const authId = req.user._id
  const isMe = String(userId) === String(authId)
  if (!isMe) match.public = true
  try {
    if (tagsFilter) {
      tagsFilter = tagsFilter.replace(/'/g, '"') // parse does not accepts "'"
      tagsFilter = JSON.parse(tagsFilter as string)
      if (Array.isArray(tagsFilter)) match.tags = { $in: tagsFilter.map((t) => new RegExp(t)) }
      else throw Error('Tags filter must be an array')
    }
  } catch (err) {
    console.log(err)
    return res.status(500).json({ message: 'Provide valid tags', type: 'error', payload: null })
  }
  if (reg) {
    match.$or = [
      { title: { $regex: reg, $options: 'i' } },
      { subtitle: { $regex: reg, $options: 'i' } },
    ]
  }
  const user: UserI = await User.findById(userId)
    .select('posts')
    .populate([
      {
        path: 'posts',
        select: 'title subtitle tags author',
        options: {
          sort: {},
          skip: (+page - 1) * +limit,
          limit: +limit,
        },
        match,
      },
    ])
    .lean()
  if (!user) return res.status(404).json({ message: 'No user with such id', type: 'warning' })
  const userPosts = {
    page,
    limit,
    last: user.posts.length,
    items: user.posts,
  }
  res.json({
    message: 'User posts received',
    type: 'success',
    payload: userPosts,
  })
}

export const getMySaves = async (req: RequestExtended, res: Response) => {
  const { page = 1, limit = 1000, tags, regexp } = getQueryPageAndLimit(req.query)
  let tagsFilter = nullifyString(tags as string)
  const reg = nullifyString(regexp as string)
  const match: any = {}
  const userId = req.params.id
  if (!userId) return res.status(404).json({ message: 'No id specified', type: 'warning' })
  const authId = req.user._id
  const isMe = String(userId) === String(authId)
  if (!isMe) match.public = true
  try {
    if (tagsFilter) {
      tagsFilter = tagsFilter.replace(/'/g, '"') // parse does not accepts "'"
      tagsFilter = JSON.parse(tagsFilter as string)
      if (Array.isArray(tagsFilter)) match.tags = { $in: tagsFilter.map((t) => new RegExp(t)) }
      else throw Error('Tags filter must be an array')
    }
  } catch (err) {
    console.log(err)
    return res.status(500).json({ message: 'Provide valid tags', type: 'error', payload: null })
  }
  if (reg) {
    match.$or = [
      { title: { $regex: reg, $options: 'i' } },
      { subtitle: { $regex: reg, $options: 'i' } },
    ]
  }
  const user: UserI = await User.findById(userId)
    .select('saves')
    .populate([
      {
        path: 'saves',
        select: 'title subtitle tags author',
        options: {
          sort: {},
          skip: (+page - 1) * +limit,
          limit: +limit,
        },
        match,
      },
    ])
    .lean()
  if (!user) return res.status(404).json({ message: 'No user with such id', type: 'warning' })
  const userPosts = {
    page,
    limit,
    last: user.saves.length,
    items: user.saves,
  }
  res.json({
    message: 'User saves received',
    type: 'success',
    payload: userPosts,
  })
}

export const updateUser = async (req: RequestExtended, res: Response) => {
  if (!req.body) throw new Error('Body is empty')
  if (!req.user) throw new Error('User is not verified')
  const result = await User.findByIdAndUpdate(req.user._id, req.body, { new: true }).select(
    selectUserWithoutPosts,
  )
  res.status(200).json({ message: 'User updated', type: 'success', payload: result })
}

export const register = async (req: Request, res: Response) => {
  const { alias, email, password } = req.body
  if (!alias || !email || !password)
    throw new Error('Invalid credentials: alias & email & password needed') //  not res to log for dev mode
  const alreadyPotential = potentialUsers.find((u) => u.email == email)
  if (alreadyPotential)
    return res
      .status(202)
      .json({ message: 'Check your email or look for confirm letter', type: 'success' })
  const existing = await User.findOne({ $or: [{ alias: alias }, { email: email }] })
  if (existing) {
    return res
      .status(409)
      .json({ message: 'User with such name or email already exists', type: 'warning' })
  }
  const hash = randomBytes(32).toString('hex')
  potentialUsers.push({ alias, email, password, hash })
  setTimeout(() => {
    potentialUsers = potentialUsers.filter((u) => u.hash !== hash)
  }, 1000 * 60 * 5) // delete after 5 min
  sendMail(hash, email)
  res.json({
    message: 'Confirm user via email',
    type: 'success',
    payload: 'Confirmation was sent on ' + email,
  })
}

export const login = async (req: Request, res: Response) => {
  const { login, password } = req.body
  if (!login || !password)
    return res
      .status(401)
      .json({ message: 'Invalid Credentials: login & password needed', type: 'warning' })
  const user = await User.findOne({ $or: [{ alias: login }, { email: login }] })
  if (!user) {
    return res.status(404).json({ message: 'No user with such credentials', type: 'warning' })
  }
  const success = await crypt.compare(password, user.password)
  if (!success)
    return res
      .status(401)
      .json({ message: 'Credentials: invalid login or password', type: 'error' })
  const expires = moment().add(2, 'days').valueOf()
  const token = sign(
    {
      id: user._id,
      exp: expires,
    },
    req.app.settings.jwtTokenSecret,
  )
  res.json({
    message: 'user confirmed',
    payload: { token, expires: moment(expires), user },
    type: 'success',
  })
}

export const confirmEmail = async (req: Request, res: Response) => {
  const hash = req.params.hash
  const potential = potentialUsers.find((u) => u.hash == hash)
  if (potential) {
    potentialUsers = potentialUsers.filter((u) => u.hash !== hash)
    const userData: UserRegistrationI = potential
    userData.password = await crypt.hash(userData.password)
    const user = await User.create(userData)
    const expires = moment().add(2, 'days').valueOf()
    const token = sign(
      {
        id: user._id,
        exp: expires,
      },
      req.app.settings.jwtTokenSecret,
    )
    res.json({
      message: 'User confirmed',
      payload: { token, expires: moment(expires), user },
      type: 'success',
    })
  } else res.status(404).json({ message: 'Account already confirmed', type: 'error' })
}
