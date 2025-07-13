

import express from 'express'
import { protectedRoute } from '../middlewares/auth.middleware.js'
import { adminRoute } from '../middlewares/admin.middleware.js'
import { addAchievement, deleteAchievement, getAchievements } from '../controllers/achievement.experience.controller.js'
import { addExperience } from '../controllers/achievement.experience.controller.js'
import { assignAchievementToUser } from '../controllers/achievement.experience.controller.js'
import {upload} from '../config/multer.js'

const router = express.Router()


router.post('/experience',protectedRoute,addExperience)

router.post('/achievement',protectedRoute,upload.single("image"),addAchievement)

router.get('/get-achievement',getAchievements)

router.delete('/:id',protectedRoute,adminRoute,deleteAchievement)


export default router
