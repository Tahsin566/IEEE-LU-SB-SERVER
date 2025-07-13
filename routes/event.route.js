

import express from "express"
import { addEvent,getEventsByDate,getUpcomingEventDetailsImageAndCountDown,getFeaturedEvents,getEventByCategory,updateEvent, deleteEvent, getAllEvent, getsingleEvent} from "../controllers/event.controller.js"
import { upload } from "../config/multer.js"
import { protectedRoute } from "../middlewares/auth.middleware.js"
import { adminRoute } from "../middlewares/admin.middleware.js"

const router = express.Router()

router.get('/get-event',getAllEvent)
router.get('/get-upcoming-event',getUpcomingEventDetailsImageAndCountDown)
router.get('/featured-event',getFeaturedEvents)
router.get('/category/:category',getEventByCategory)
router.get('/:id',protectedRoute,adminRoute,getsingleEvent)
router.post('/add-event',protectedRoute,adminRoute,upload.single('image'),addEvent)
router.post('/update-event',protectedRoute,adminRoute,upload.single('image'),updateEvent)
router.post('/date-filter',getEventsByDate)
router.delete('/:id',protectedRoute,adminRoute,deleteEvent)


export default router

