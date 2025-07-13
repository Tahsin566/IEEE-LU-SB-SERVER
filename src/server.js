
import express from 'express'
import cors from 'cors'
import AuthRouter from '../routes/user.route.js'
import BlogRouter from '../routes/blog.route.js'
import ResearchRouter from '../routes/research.route.js'
import { mongoconnect } from '../config/mongodb.js'
import cookieParser from 'cookie-parser'
import path from 'path'
import dotenv from 'dotenv'
import fs from 'fs'
import { Errorhandler } from '../middlewares/error.middleware.js'
import slugify from 'slugify'
import EventRouter from '../routes/event.route.js'
import MagazineRouter from '../routes/magazine.route.js'
import NewsRouter from '../routes/news.route.js'
import ContactRouter from '../routes/contact.route.js'
import CommitteeRouter from '../routes/committee.route.js'
import IeeeRouter from '../routes/ieee.about.route.js'
import ExperienceAchievementRouter from '../routes/achievement.experience.route.js'
import BannerRouter from '../routes/banner.route.js'
import FaqRouter from '../routes/faq.route.js'
import GalleryRouter from '../routes/gallery.route.js'
import { adminRoute } from '../middlewares/admin.middleware.js'
import { protectedRoute } from '../middlewares/auth.middleware.js'

dotenv.config()

const app = express()


app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use('/files',express.static('files'))
app.use('/css',express.static('views/css'))


app.use(cors({
    origin:'https://ieeelusb.netlify.app',
    credentials:true
}))
app.use(cookieParser())


app.use('/auth',AuthRouter)
app.use('/blog',BlogRouter)
app.use('/research',ResearchRouter)
app.use('/event',EventRouter)
app.use('/magazine',MagazineRouter)
app.use('/news',NewsRouter)
app.use('/contact',ContactRouter)
app.use('/committee',CommitteeRouter)
app.use('/ieee',IeeeRouter)
app.use('/experience-achievement',ExperienceAchievementRouter)
app.use('/faq',FaqRouter)
app.use('/gallery',GalleryRouter)
app.use('/banner',BannerRouter)



app.get('/home',async(req,res)=>{
    
    res.status(200).json({success:true,text:'Home'})

})


app.get('/clear',protectedRoute,adminRoute,(req,res)=>{

    fs.readdir('files',(err,files)=>{
        if(err) throw err
        for(const file of files){
            fs.unlink(path.join('files',file),(err)=>{
                if(err) throw err
            })
        }
    })
    res.status(200).json({message:'cleared'})
})



app.use(Errorhandler)


app.listen(4000,async()=>{
    console.log("Listening on port 4000")
    await mongoconnect()
})