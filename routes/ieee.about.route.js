
import express from 'express'
import { IEEE } from '../models/ieee.about.model.js'
import { protectedRoute } from '../middlewares/auth.middleware.js'
import { adminRoute } from '../middlewares/admin.middleware.js'
import { AddOrUpdateIEEEAbout, getIEEEAbout, AddOrUpdateAchievementAward } from '../controllers/ieee.about.controller.js'
import { upload } from '../config/multer.js'


const router = express.Router()

router.get('/',getIEEEAbout)

router.post('/',protectedRoute,adminRoute,upload.single("image"),AddOrUpdateIEEEAbout)

router.post('/add-achievement-awards',protectedRoute,adminRoute,AddOrUpdateAchievementAward)

export default router
