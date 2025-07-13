
import fs from 'fs'
import { Magazine } from "../models/magazine.model.js"
import { deleteFile, uploadFile } from '../config/cloudinary.js'

export const getSingleMagazine = async(req,res,next)=>{
    try {
        const magazine = await Magazine.findById(req.params.id)
        res.status(200).json({success:true,magazine})
    } catch (error) {
        next(error)
    }
}

export const getMagazineByCategory = async(req,res,next)=>{
    
    try {
        const magazine = await Magazine.find({category:req.params.category})
        res.status(200).json({success:true,magazine})
    } catch (error) {
        next(error)
    }
}

export const getMagazineByDate = async(req,res,next)=>{

    const {order} = req.params

    try {
        if(order === 'Oldest'){
            const magazine = await Magazine.find({},{},{sort:{createdAt:1}})
            return res.status(200).json({success:true,magazine:magazine})
        }
        const magazine = await Magazine.find({},{},{sort:{createdAt:-1}})
        return res.status(200).json({success:true,magazine:magazine})
    } catch (error) {
        next(error)
    }
}


export const addMagazine = async(req,res,next)=>{
    
    const {
        title,
        description,
        issueNumber,
        volumeNumber,
        publicationDate,
        category,
        author
    } = req.body

    const existingMagazine = await Magazine.findOne({title})

    if(existingMagazine){
        fs.unlinkSync(req?.files[0]?.path)
        fs.unlinkSync(req?.files[1]?.path)
        return res.status(409).json({success:false,message:'magazine already exists'})
    }

    if(!(title && description && issueNumber && volumeNumber  && category && author)){
        fs.unlinkSync(req?.files[0]?.path)
        fs.unlinkSync(req?.files[1]?.path)
        return res.status(400).json({success:false,message:'all fields are required'})
    }

    try {
        
        const magazineImage = await uploadFile(req?.files[0]?.path) || ''
        const magazineFile = await uploadFile(req?.files[1]?.path) || ''  

        const newMagazine = new Magazine({
            title,
            description,
            issueNumber,
            volumeNumber,
            publicationDate,
            category,
            author,
            magazineImage:magazineImage,
            magazineFile:magazineFile
        })
        await newMagazine.save()

        res.status(201).json({success:true,message:'Magazine added'})
    } catch (error) {
        fs.unlinkSync(req?.files[0]?.path)
        fs.unlinkSync(req?.files[1]?.path)
        next(error)
    }
}

export const getMagazine = async(req,res,next)=>{
    try {
        const allMagazine = await Magazine.find()
        res.status(200).json({success:true,magazine:allMagazine})
    } catch (error) {
        next(error)
    }
}

export const updateMagazine = async(req,res,next)=>{

    
    const {id,title,description,issueNumber,volumeNumber,publicationDate,category,author} = req.body

    if(!id){
        return res.status(400).json({success:false,message:'magazine id is required'})
    }


    if(!(id && title && description && issueNumber && volumeNumber && category && author)){

        return res.status(400).json({success:false,message:'all fields are required'})
    }

    try {
        const existingMagazine = await Magazine.findById(id)
        if(!existingMagazine){
            
            return res.status(404).json({success:false,message:'magazine not found'})
        } 
        existingMagazine.title = title
        existingMagazine.description = description
        existingMagazine.issueNumber = issueNumber
        existingMagazine.volumeNumber = volumeNumber
        existingMagazine.publicationDate = publicationDate
        existingMagazine.category = category
        existingMagazine.author = author

        if(req.files[0] && req.files[1]){

            await deleteFile(existingMagazine.magazineImage)
            await deleteFile(existingMagazine.magazineFile)
            existingMagazine.magazineImage = await uploadFile(req?.files[0]?.path) || ''
            existingMagazine.magazineFile = await uploadFile(req?.files[1]?.path) || ''

        }

        if(req.files[0] && req.files[1] === undefined && req.files[0]?.mimetype === "image/jpeg" || req.files[0]?.mimetype === "image/png"){
            await deleteFile(existingMagazine.magazineImage)
            existingMagazine.magazineImage = await uploadFile(req?.files[0]?.path) || ''
        }

        if(req.files[0] && req.files[1] === undefined && req.files[0]?.mimetype === "application/pdf"){
            await deleteFile(existingMagazine?.magazineFile)
            existingMagazine.magazineFile = await uploadFile(req?.files[0]?.path) || ''
        }

        await existingMagazine.save()

        res.status(200).json({success:true,magazine:existingMagazine})
    } catch (error) {
        next(error)
    }
}

export const deleteMagazine = async(req,res,next)=>{
    const {id} = req.params
    if(!id){
        return res.status(400).json({success:false,message:'magazine id is required'})
    }
    try {
        const existingMagazine = await Magazine.findOne({_id:id})
        if(!existingMagazine) return res.status(404).json({success:false,message:'magazine not found'})

        existingMagazine.magazineImage ? await deleteFile(existingMagazine?.magazineImage):null
        existingMagazine.magazineFile? await deleteFile(existingMagazine?.magazineFile):null
        await Magazine.deleteOne({_id:id})
        return res.status(200).json({deleted:true})
    } catch (error) {
        next(error)
    }
}



