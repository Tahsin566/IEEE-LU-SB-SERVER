import express from 'express'
import { addNews, getNews, getSingleNews,getNewsByCategory, updateNews, deleteNews } from '../controllers/news.controller.js'
import { upload } from '../config/multer.js'
import { protectedRoute } from '../middlewares/auth.middleware.js'
import { adminRoute } from '../middlewares/admin.middleware.js'

const router = express.Router()

router.get('/get-news',getNews)
router.get('/:id',protectedRoute,getSingleNews)
router.get('/category/:category',getNewsByCategory)
router.post('/',protectedRoute,adminRoute,upload.single('newsImage'),addNews)
router.post('/update-news',protectedRoute,adminRoute,upload.single('newsImage'),updateNews)
router.delete('/:id',protectedRoute,adminRoute,deleteNews)

export default router