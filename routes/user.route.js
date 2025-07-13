
import express from 'express'
import { getProfile, signUp,signIn, signOut, getAllUsers, uploadProfilePicture,getUserProfile, addSocialLinks, resetPassword, ChangePassByAdmin} from '../controllers/auth.controller.js'
import { protectedRoute } from '../middlewares/auth.middleware.js'
import { upload } from '../config/multer.js'
import { adminRoute } from '../middlewares/admin.middleware.js'

const router = express.Router()


router.get('/user',getAllUsers)
router.get('/',protectedRoute,getProfile)
router.get('/signout',signOut)
router.post('/',signUp)
router.post('/signin',signIn)
router.post('/link',protectedRoute,addSocialLinks)
router.post('/change-pass',protectedRoute,adminRoute,ChangePassByAdmin)
router.post('/reset',protectedRoute,resetPassword)
router.post('/upload-image',protectedRoute,upload.single("image"),uploadProfilePicture)
router.get('/:id',protectedRoute,getUserProfile)




export default router