import { Router } from 'express'

import * as homeController from '@/controller/Home'

const router = Router()

router.get('/', homeController.getAppInfo)

router.get('/index', homeController.getMainPage)

<<<<<<< HEAD
router.get('/mail', homeController.sendMailR)
=======
router.get('/mail/:mail', homeController.sendMailR)
>>>>>>> 17d4207a9c3f41626b9e6b8edb4826c37ac3e012

export default router
