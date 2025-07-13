
import express from 'express'
import { adminRoute } from '../middlewares/admin.middleware.js'
import { protectedRoute } from '../middlewares/auth.middleware.js'
import { getBlog, updateBlog, addBlog, deleteBlog, getSingleBlog, getBlogByCategory, getBlogByDate, approveBlog, getApprovedBlog } from '../controllers/blog.controller.js'
import { upload } from '../config/multer.js'

const router = express.Router()


router.get('/get-blog',getBlog)
router.get('/get-approved-blog',getApprovedBlog)
router.get('/:id',protectedRoute,getSingleBlog)
router.get('/category/:category',getBlogByCategory)
router.get('/time/:order',getBlogByDate)
router.patch('/approve-blog/:id',protectedRoute,adminRoute,approveBlog)
router.post('/',protectedRoute,upload.single('blogImage'),addBlog)
router.post('/update-blog',protectedRoute,adminRoute,upload.single('blogImage'),updateBlog)
router.delete('/:id',protectedRoute,adminRoute,deleteBlog)

export default router