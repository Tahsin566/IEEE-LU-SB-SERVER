
import { News } from "../models/news.model.js"
import { upload } from "../config/multer.js"
import fs from 'fs'
import { deleteFile,uploadFile } from "../config/cloudinary.js"
import { newsValidator } from "../validator/news.validator.js"

export const getNews = async(req,res,next)=>{
    try {
        const news = await News.find()

        const trendingNews = await News.find().sort({createdAt:1}).limit(2)
        res.status(200).json({success:true,news,trendingNews})
    } catch (error) {
        next(error)
    }
}

export const getSingleNews = async(req,res,next)=>{
    try {
        const news = await News.findById(req.params.id)
        res.status(200).json({success:true,news})
    } catch (error) {
        next(error)
    }
}

export const getNewsByCategory = async (req, res, next) => {
    try {
        const { category } = req.params
        const news = await News.find({ category:category })
        res.status(200).json({ success: true, news })
    } catch (error) {
        next(error)
    }
}


export const addNews = async(req,res,next)=>{

    const {title,markdown,author,tags,category} = req.body


    const existingNews = await News.findOne({title})
    if(existingNews){
        return res.status(409).json({success:false,message:'news already exists'})
    }

    if(!(title && author && tags && markdown && category)){
        return res.status(400).json({success:false,message:'all fields are required'})
    }

    const isValid = newsValidator(title,author,tags,category)
    
    if(!isValid){
        return res.json({success:false,message:isValid.message})
    }

    try {

        if(!(title && author && tags && markdown && category)){
            return res.status(400).json({success:false,message:'all fields are required'})
        }

        const newsImage = await uploadFile(req?.file?.path) || ''

        const news = new News({title,author,tags,newsImage:newsImage,markdown,category})
        await news.save()
    
        res.status(201).json({success:true,message:'news added successfully'})
    } catch (error) {
        next(error)
    }
}

export const updateNews = async(req,res,next)=>{
    const {id,title,markdown,author,tags,category} = req.body
    if(!id){
        return res.status(400).json({success:false,message:'news id is required'})
    }
    if(!(id && title && author && tags && markdown && category)){
        if(req?.file?.path){
            fs.unlinkSync(req?.file?.path)
        }
        return res.status(400).json({success:false,message:'all fields are required'})
    }
    try {
        const existingNews = await News.findOne({_id:id})
        if(!existingNews) {
            return res.status(404).json({success:false,message:'news not found'})
        }
        existingNews.title = title
        existingNews.author = author
        existingNews.tags = tags
        existingNews.markdown = markdown
        existingNews.category = category
        
        
        if(req?.file){
            await deleteFile(existingNews?.newsImage)
            existingNews.newsImage = await uploadFile(req?.file?.path) || ''
        }

        await existingNews.save()

        res.status(200).json({success:true,news:existingNews})
    } catch (error) {
        next(error)
    }
}


export const deleteNews = async(req,res,next)=>{
    const {id} = req.params
    if(!id){
        return res.status(400).json({success:false,message:'news id is required'})
    }
    try {
        const existingNews = await News.findOne({_id:id})
        if(!existingNews) return res.status(404).json({success:false,message:'news not found'})
        existingNews.newsImage ? await deleteFile(existingNews?.newsImage) : null
        await News.deleteOne({_id:id})
        return res.status(200).json({deleted:true})
    } catch (error) {
        next(error)
    }
}


