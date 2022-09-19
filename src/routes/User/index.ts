import { Router } from 'express'

import { catchAsync } from './../../utils/catchAsync'

import * as photoController from '../../controller/Photo/index'
import * as userController from '../../controller/User/index'

import { authorize } from '@/middlewares/authorize'

export const usersRouter = Router()

usersRouter.get('/', authorize, catchAsync(userController.getUsers))

usersRouter.get('/:id', authorize, catchAsync(userController.getUserDetails))

usersRouter.get('/:id/posts', authorize, catchAsync(userController.getUserPosts))

usersRouter.get('/:id/saves/', authorize, catchAsync(userController.getMySaves))

usersRouter.patch('/update', authorize, catchAsync(userController.updateUser))

usersRouter.patch('/change_password', authorize, catchAsync(userController.changePassword))

usersRouter.post('/register', catchAsync(userController.register))

usersRouter.post('/login', catchAsync(userController.login))

usersRouter.get('/confirm/:hash', catchAsync(userController.confirmEmail))

usersRouter.put('/photo', authorize, catchAsync(photoController.updatePhoto))
