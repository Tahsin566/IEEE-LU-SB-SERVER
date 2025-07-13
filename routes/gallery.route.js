
import express from "express"
import { addToGallery, deleteFromGallery, getGallery, getsinglePhoto, updateGallery } from "../controllers/gallery.controller.js"
import { upload } from "../config/multer.js"
import { protectedRoute } from "../middlewares/auth.middleware.js"
import { adminRoute } from "../middlewares/admin.middleware.js"

const router = express.Router()

router.get('/get-gallery',getGallery)
router.get('/:id',protectedRoute,adminRoute,getsinglePhoto)
router.post('/add-gallery',protectedRoute,adminRoute,upload.single('image'),addToGallery)
router.post('/update-gallery',protectedRoute,adminRoute,upload.single('image'),updateGallery)
router.delete('/:id',protectedRoute,adminRoute,deleteFromGallery)

export default router