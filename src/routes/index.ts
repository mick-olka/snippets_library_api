import * as homeController from '@/controller/home'

import { Router } from 'express'
import * as fs from 'fs'
import path from 'path'

const router = Router()

router.get('/', homeController.getAppInfo)

router.get('/index', homeController.getMainPage)

router.get('/write/', (req, res) => {
  const txt = req.query.text
  fs.appendFileSync(path.resolve(__dirname, 'text.txt'), txt as string)
  const result = fs.readFileSync(path.resolve(__dirname, 'text.txt'), 'utf-8')
  res.json(result)
})

export default router
