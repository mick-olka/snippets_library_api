import { Router } from 'express'

import * as userController from '../../controller/User/index'

export const usersRouter = Router()

usersRouter.get('/', userController.getUsers)

usersRouter.post('/', userController.createUser)
