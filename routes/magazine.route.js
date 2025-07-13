
import express from 'express'
import { addMagazine ,getMagazine, getSingleMagazine,getMagazineByCategory,getMagazineByDate, deleteMagazine, updateMagazine} from '../controllers/magazine.controller.js'
import { upload } from '../config/multer.js'
import { protectedRoute } from '../middlewares/auth.middleware.js'
import { adminRoute } from '../middlewares/admin.middleware.js'


const router = express.Router()

router.get('/get-magazine',getMagazine)
router.get('/category/:category',getMagazineByCategory)
router.get('/time/:order',getMagazineByDate)
router.get('/:id',protectedRoute,getSingleMagazine)
router.post('/',protectedRoute,adminRoute,upload.any(),addMagazine)
router.post('/update-magazine',protectedRoute,adminRoute,upload.any(),updateMagazine)
router.delete('/:id',protectedRoute,adminRoute,deleteMagazine)

export default router