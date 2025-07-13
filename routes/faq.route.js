
import express from 'express'
import { Faq } from '../models/faq.model.js'

const router = express.Router()

router.get('/',async(req,res,next)=>{
    try {
        const allFaq = await Faq.find()
        res.status(200).json({success:true,faq:allFaq})
    } catch (error) {
        next(error)
    }
})


router.post('/',async(req,res,next)=>{
    try {
        const {question,answer,category} = req.body
        if(!(question && answer && category)){
            return res.status(400).json({success:false,message:'all fields are required'})
        }

        const existingFaq = await Faq.findOne({question})
        if(existingFaq){
            return res.status(409).json({success:false,message:'faq already exists'})
        }
        const newFaq = new Faq({question,answer,category})
        await newFaq.save()
        res.status(201).json({success:true,message:'Faq added'})
    } catch (error) {
        next(error)
    }
})


export default router