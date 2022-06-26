import { Request, Response } from 'express'

import { Post } from '@/models/Post'
import { User } from '@/models/User'
import { RequestExtended } from '@/types/interfaces'

export const createPost = async (req: RequestExtended, res: Response) => {
  if (!req.body) throw new Error('Body is empty')
  if (!req.user) throw new Error('Need to login')
  const postData = req.body
  if (!postData.title)
    return res.status(402).json({ type: 'warning', message: 'Please provide a title' })
  postData.author = req.user.id
  const result = await Post.create(postData)
  await User.findByIdAndUpdate(req.user.id, { $push: { posts: result._id } })
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
  // check if it's author
  if (req.user.id !== String(post.author))
    return res.status(403).json({ type: 'warning', message: 'You do not have permission' })
  const result = await Post.findByIdAndDelete(id)
  await User.findByIdAndUpdate(req.user.id, { $pull: { posts: result!._id } })
  res.status(200).json({ message: 'Post deleted', type: 'success', payload: result })
}
