import { Router } from 'express'

import { catchAsync } from './../../utils/catchAsync'

import * as postController from '../../controller/Post/index'

import { authorize } from '@/middlewares/authorize'

export const postsRouter = Router()

postsRouter.get('/', authorize, catchAsync(postController.getPosts))

postsRouter.get('/:id', authorize, catchAsync(postController.getPostDetails))

postsRouter.put('/:id/vote', authorize, catchAsync(postController.feedbackPost))

postsRouter.post('/', authorize, catchAsync(postController.createPost))

postsRouter.patch('/update/:id', authorize, catchAsync(postController.updatePost))

postsRouter.delete('/delete/:id', authorize, catchAsync(postController.deletePost))

postsRouter.put('/save/:postId', authorize, catchAsync(postController.savePost))

postsRouter.put('/delete_saves', authorize, catchAsync(postController.deleteSaves))
