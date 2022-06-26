import { Router } from 'express'

import { catchAsync } from './../../utils/catchAsync'

import * as userController from '../../controller/User/index'

import { authorize } from '@/middlewares/authorize'

export const usersRouter = Router()

usersRouter.get('/', authorize, catchAsync(userController.getUsers))

usersRouter.patch('/update', authorize, catchAsync(userController.updateUser))

usersRouter.post('/register', catchAsync(userController.register))

usersRouter.post('/login', catchAsync(userController.login))

usersRouter.get('/confirm/:hash', catchAsync(userController.confirmEmail))
