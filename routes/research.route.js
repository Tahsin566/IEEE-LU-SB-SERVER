
import express from 'express'
import { addResearch, getResearch, getsingleResearch,getResearchByDate, getResearchByCategory, updateResearch, deleteResearch, approveResearch, getApprovedResearch } from '../controllers/research.controller.js'
import { upload } from '../config/multer.js'
import { protectedRoute } from '../middlewares/auth.middleware.js'
import { adminRoute } from '../middlewares/admin.middleware.js'

const router = express.Router()

router.get('/',getResearch)
router.get('/get-approved-paper',getApprovedResearch)
router.get('/:id',protectedRoute,getsingleResearch)
router.get('/time/:order',getResearchByDate)
router.get('/category/:category',getResearchByCategory)
router.patch('/approve-paper/:id',protectedRoute,adminRoute,approveResearch)
router.post('/add-paper',protectedRoute,upload.any(),addResearch)
router.post('/update-research',protectedRoute,adminRoute,upload.any(),updateResearch)
router.delete('/:id',protectedRoute,adminRoute,deleteResearch)

export default router