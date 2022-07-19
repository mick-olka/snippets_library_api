/* eslint-disable import/order */
import { Response } from 'express'

import { Post, selectArgsMinimized } from '@/models/Post'
import { User } from '@/models/User'
import { RequestExtended } from '@/types/Request'
import { nullifyString } from '@/utils/filter'

const checkMyVote = (userId: string, upvoters: string[], downvoters: string[]) => {
  const upvoted = !!upvoters.filter((i: any) => i.equals(userId)).length
  const downvoted = !!downvoters.filter((i: any) => i.equals(userId)).length
  if (upvoted) return 1
  if (downvoted) return -1
  return 0
}

export const createPost = async (req: RequestExtended, res: Response) => {
  if (!req.body) throw new Error('Body is empty')
  if (!req.user) throw new Error('Need to login')
  const postData = req.body
  if (!postData.title)
    return res.status(402).json({ type: 'warning', message: 'Please provide a title' })
  postData.author = req.user._id
  const result = await Post.create(postData)
  await User.findByIdAndUpdate(req.user._id, { $push: { posts: result._id } })
  res.status(200).json({ message: 'Post created', type: 'success', payload: result })
}

export const getPostDetails = async (req: RequestExtended, res: Response) => {
  const postId = req.params.id
  const userId = req.user._id
  if (!postId) return res.status(404).json({ message: 'No id specified', type: 'warning' })
  const post = await Post.findById(postId).populate({ path: 'author', select: 'name' }).lean()
  if (!post) return res.status(404).json({ message: 'Not Found', type: 'warning' })
  if (!post.public && String(post.author._id) !== String(userId))
    return res.status(404).json({ message: 'No Access', type: 'warning' })
  post.vote = checkMyVote(userId, post.upvoters, post.downvoters)
  res.json({ message: 'Post received', type: 'success', payload: post })
}

export const getPosts = async (req: RequestExtended, res: Response) => {
  const { limit = 100, page = 1, regexp, tags, userId } = req.query
  let tagsFilter = nullifyString(tags as string)
  const reg = nullifyString(regexp as string)
  const filter: any = { public: true }
  // if (req.user && userId) {
  //   // if logged and isMe
  //   if (userId === req.user.id) delete filter.public
  //   console.log(userId, req.user.id)
  // }
  if (userId) filter.author = userId
  try {
    if (tagsFilter) {
      tagsFilter = tagsFilter.replace(/'/g, '"') // parse does not accepts "'"
      tagsFilter = JSON.parse(tagsFilter as string)
      if (Array.isArray(tagsFilter)) filter.tags = { $in: tagsFilter.map((t) => new RegExp(t)) }
      else throw Error('Tags filter must be an array')
    }
  } catch (err) {
    console.log(err)
    return res.status(500).json({ message: 'Provide valid tags', type: 'error', payload: null })
  }
  if (reg) {
    filter.$or = [
      { title: { $regex: reg, $options: 'i' } },
      { subtitle: { $regex: reg, $options: 'i' } },
    ]
  }
  const posts = await Post.paginate(filter, {
    limit: +limit,
    page: +page,
    select: selectArgsMinimized,
    populate: { path: 'author', select: 'alias' },
    lean: true,
  })
  posts.docs = posts.docs.map((p: any) => {
    const post = { ...p }
    post.upvotes = p.upvoters.length
    post.downvotes = p.downvoters.length
    post.vote = checkMyVote(req.user._id, post.upvoters, post.downvoters)
    delete post.upvoters
    delete post.downvoters
    return post
  })
  res.status(200).json({ message: 'Posts received', type: 'success', payload: posts })
}

export const updatePost = async (req: RequestExtended, res: Response) => {
  const id = req.params.id
  if (!id) throw new Error('Post id needed')
  if (!req.body) throw new Error('Body is empty')
  if (!req.user) throw new Error('User is not verified')
  const post = await Post.findById(id)
  if (!post) return res.status(404).json({ type: 'warning', message: 'No such post' })
  if (req.user._id !== String(post.author))
    return res.status(402).json({ type: 'warning', message: 'You do not have permission' })
  const result = await Post.findByIdAndUpdate(id, req.body, { new: true })
  res.status(200).json({ message: 'Post updated', type: 'success', payload: result })
}

export const feedbackPost = async (req: RequestExtended, res: Response) => {
  const id = req.params.id
  if (!id) throw new Error('Post id needed')
  if (!req.user) throw new Error('User is not verified')
  const userId = req.user._id
  const post = await Post.findById(id)
  if (!post) return res.status(404).json({ type: 'warning', message: 'No such post' })
  //  if author is me
  if (userId === String(post.author))
    return res.status(403).json({ type: 'warning', message: "You can't vote your post" })
  let positive: any = req.query.positive || 'true'
  positive = positive === 'false' ? false : true
  const update: any = {}
  if (positive) {
    if (post.upvoters.includes(userId)) update.$pull = { upvoters: userId }
    else update.$addToSet = { upvoters: userId }
    update.$pullAll = { downvoters: [userId] }
  } else {
    if (post.downvoters.includes(userId)) update.$pull = { downvoters: userId }
    else update.$addToSet = { downvoters: userId }
    update.$pullAll = { upvoters: [userId] }
  }
  const updated = await Post.findByIdAndUpdate(id, update, { new: true })
  res.status(200).json({
    message: 'Feedback received',
    type: 'success',
    payload: {
      upvoted: updated.upvoters.includes(userId),
      downvoted: updated.downvoters.includes(userId),
    },
  })
}

export const deletePost = async (req: RequestExtended, res: Response) => {
  const id = req.params.id
  if (!id) throw new Error('Post id needed')
  const post = await Post.findById(id)
  if (!post) return res.status(404).json({ type: 'warning', message: 'No such post' })
  // check if it's author
  if (String(req.user._id) !== String(post.author))
    return res.status(403).json({ type: 'warning', message: 'You do not have permission' })
  const result = await Post.findByIdAndDelete(id)
  await User.findByIdAndUpdate(req.user._id, { $pull: { posts: result!._id } })
  res.status(200).json({ message: 'Post deleted', type: 'success', payload: result })
}

export const savePost = async (req: RequestExtended, res: Response) => {
  const postId = req.params.postId
  console.log(postId)
  if (!postId) throw new Error('Post id needed')
  const post = await Post.findById(postId)
  if (!post) return res.status(404).json({ type: 'warning', message: 'No such post' })
  await User.findByIdAndUpdate(req.user._id, { $push: { saves: post._id } })
  res.status(200).json({ message: 'Post saved', type: 'success', payload: post._id })
}

export const deleteSaves = async (req: RequestExtended, res: Response) => {
  const posts = req.body.postsIds
  if (!posts) return res.status(404).json({ type: 'warning', message: 'No postss ids scpecified' })
  if (!Array.isArray(posts)) throw Error('Posts ids must be an array')
  await User.findByIdAndUpdate(req.user._id, { $pullAll: { saves: posts } })
  res.status(200).json({ message: 'Saves deleted', type: 'success', payload: posts })
}
