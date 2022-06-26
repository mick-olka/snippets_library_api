import { Router } from 'express'

import { catchAsync } from './../../utils/catchAsync'

import * as postController from '../../controller/Post/index'

import { authorize } from '@/middlewares/authorize'

export const postsRouter = Router()

postsRouter.get('/', catchAsync(postController.getPosts))

// postsRouter.patch('/update', authorize, catchAsync(userController.updateUser))

// postsRouter.post('/register', catchAsync(userController.register))

// postsRouter.post('/login', catchAsync(userController.login))

// postsRouter.get('/confirm/:hash', catchAsync(userController.confirmEmail))
