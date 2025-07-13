
import express from 'express';
import { Banner } from '../models/banner.model.js';
import { adminRoute } from '../middlewares/admin.middleware.js';
import { protectedRoute } from '../middlewares/auth.middleware.js';
import { upload } from '../config/multer.js';
import fs from 'fs';
import path from 'path';
import { deleteFile, uploadFile, uploadImage } from '../config/cloudinary.js';

const router = express.Router();

router.get('/', async (req, res, next) => {

    try {
        const banner = await Banner.find().limit(5)
        res.status(200).json({ success: true, banner })
    } catch (error) {
        next(error)
    }
});

router.post('/add-banner', protectedRoute, adminRoute, upload.single("image"), async (req, res, next) => {

    try {
        const newBanner = new Banner({
            title: req.body.title || '',
            bannerType: req.body.type || '',
            description: req.body.description || '',
            image: await uploadImage(req.file?.path,50) || '',
            // image:`http://localhost:4000/${req.file?.path}`
        })
        await newBanner.save()
        return res.status(200).json({ success: true, message: "Banner added successfully" })
    }
    catch (error) {
        next(error)
    }
})

router.delete('/:id', protectedRoute, adminRoute, async (req, res, next) => {
    try {
        const banner = await Banner.findById(req.params.id)
        banner.image ? await deleteFile(banner?.image) : null

        const bannerDeleted = await Banner.findByIdAndDelete(req.params.id)

        return res.status(404).json({ success: true, message: "Banner deleted" })
    } catch (error) {
        next(error)
    }
})

export default router;