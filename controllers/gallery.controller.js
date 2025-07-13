import { deleteFile, uploadFile } from "../config/cloudinary.js"
import { Gallery } from "../models/gallery.model.js"
import fs from 'fs'

export const getGallery = async(req,res,next)=>{
    try {
        const allGallery = await Gallery.find()
        res.status(200).json({success:true,gallery:allGallery})
    } catch (error) {
        next(error)
    }
}

export const getsinglePhoto = async(req,res,next)=>{
    try {
        const research = await Gallery.findById(req.params.id)
        res.status(200).json({success:true,research})
    } catch (error) {
        next(error)
    }
}


export const addToGallery = async(req,res,next)=>{

    const {caption} = req.body
    
    if(!(caption && req.file)){
        return res.status(201).json({success:false,message:'all fields are required'})
    }

    try {
        const galleryphoto = await uploadFile(req?.file?.path)
        const neWGallery = new Gallery({
            image:galleryphoto,
            caption
        })
        await neWGallery.save()
        res.status(201).json({success:true,message:'image added successfully'})
    } catch (error) {
        next(error)
    }
}


export const updateGallery = async(req,res,next)=>{
    

    const {id,caption} = req.body


    if(!id){
        return res.status(400).json({success:false,message:'gallery id is required'})
    }
    if(!(id && caption)){
        return res.status(400).json({success:false,message:'all fields are required'})
    }
    try {
        const existingGallery = await Gallery.findById(id)
        existingGallery.caption = caption
        if(!existingGallery){
            return res.status(404).json({success:false,message:'gallery not found'})
        }
        if(req?.file?.path){
            await deleteFile(existingGallery?.image)
            existingGallery.image = await uploadFile(req?.file?.path) || ''
        }

        await existingGallery.save()
        res.status(200).json({success:true,message:'image updated successfully'})
    } catch (error) {
        next(error)
    }
}

export const deleteFromGallery = async(req,res,next)=>{
    
    const {id} = req.params
    if(!id){
        return res.status(400).json({success:false,message:'gallery image id is required'})
    }
    try {
        const existingGallery = await Gallery.findOne({_id:id})
        if(!existingGallery){
            return res.status(404).json({success:false,message:'gallery image not found'})
        }
        existingGallery.image ? await deleteFile(existingGallery?.image) : null
        await existingGallery.deleteOne()
        res.status(200).json({success:true,message:'image deleted successfully'})
    } catch (error) {
        next(error)
    }
}

