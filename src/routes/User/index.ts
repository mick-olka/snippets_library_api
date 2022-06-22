import { Router } from 'express'

import { catchAsync } from './../../utils/catchAsync'

import * as userController from '../../controller/User/index'

export const usersRouter = Router()

usersRouter.get('/', catchAsync(userController.getUsers))

//usersRouter.post('/', userController.createUser)

usersRouter.post('/register', catchAsync(userController.register))

usersRouter.get('/confirm/:hash', catchAsync(userController.confirmEmail))
