import { Router } from 'express'

import * as homeController from '@/controller/Home'

const router = Router()

router.get('/', homeController.getAppInfo)

router.get('/index', homeController.getMainPage)

//router.get('/mail', homeController.sendMailR)

export default router
