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
  const posts = await Post.find().select('title subtitle author').populate('author', 'name')
  res.status(200).json({ message: 'Posts received', type: 'success', payload: posts })
}

export const updatePost = async (req: RequestExtended, res: Response) => {
  const id = req.params.id
  if (!id) throw new Error('Post id needed')
  if (!req.body) throw new Error('Body is empty')
  if (!req.user) throw new Error('User is not verified')
  const post = await Post.findById(id)
  if (!post) return res.status(404).json({ type: 'warning', message: 'No such post' })
  if (req.user.id !== String(post.author))
    return res.status(403).json({ type: 'warning', message: 'You do not have permission' })
  const result = await Post.findByIdAndUpdate(id, req.body, { new: true })
  res.status(200).json({ message: 'Post updated', type: 'success', payload: result })
}

export const deletePost = async (req: RequestExtended, res: Response) => {
  const id = req.params.id
  if (!id) throw new Error('Post id needed')
  if (!req.user) throw new Error('User is not verified')
  const post = await Post.findById(id)
  if (!post) return res.status(404).json({ type: 'warning', message: 'No such post' })
  if (req.user.id !== String(post.author))
    return res.status(403).json({ type: 'warning', message: 'You do not have permission' })
  const result = await Post.findByIdAndDelete(id)
  res.status(200).json({ message: 'Post deleted', type: 'success', payload: result })
}
