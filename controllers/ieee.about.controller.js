import { deleteFile, uploadFile } from "../config/cloudinary.js"
import { IEEE } from "../models/ieee.about.model.js"


export const getIEEEAbout = async(req,res,next)=>{
    try {
        const ieee = await IEEE.find()
        res.status(200).json({success:true,ieee})
    } catch (error) {
        next(error)
    }
}

export const AddOrUpdateIEEEAbout = async(req,res,next)=>{

    console.log(req.body)
    console.log(req.file)

    const existing = await IEEE.findOne()

    const {ActiveMember,NumberofEvents,awardsWon,numofWorkshop,numofIndustryCollaboration,numofProjectCompleted} = req.body

    if(existing){
        ActiveMember ? existing.ActiveMember = ActiveMember : null
        NumberofEvents ? existing.NumberofEvents = NumberofEvents : null
        awardsWon ? existing.awardsWon = awardsWon : null
        numofWorkshop ? existing.numofWorkshop = numofWorkshop : null
        numofIndustryCollaboration ? existing.numofIndustryCollaboration = numofIndustryCollaboration : null
        numofProjectCompleted ? existing.numofProjectCompleted = numofProjectCompleted : null
        if(req?.file){
            existing?.image ? await deleteFile(existing.image) : null
            existing.image = await uploadFile(req.file?.path) || ''
        }
        await existing.save()
        return res.status(200).json({success:true,message:'IEEE updated'})
    }

    try {
        
        const ieee = new IEEE({
            ActiveMember:req.body.ActiveMember,
            NumberofEvents:req.body.NumberofEvents,
            awardsWon:req.body.awardsWon,
            numofWorkshop:req.body.numofWorkshop,
            numofIndustryCollaboration:req.body.numofIndustryCollaboration,
            numofProjectCompleted:req.body.numofProjectCompleted,
            image:req?.file ? await uploadFile(req.file.path) : ''
        })
        await ieee.save()
        res.status(200).json({success:true,message:'IEEE updated'})
    } catch (error) {
        next(error)
    }
}


export const AddOrUpdateAchievementAward = async(req,res,next)=>{
    const {awards,achievements} = req.body

    try {


        const ieee = await IEEE.findOne()
        if(!ieee){
            return res.status(404).json({success:false,message:'IEEE data not found'})
        }


        const existingAwards = ieee.awards.filter(award => award?.name === awards?.name)
        const existingAchievements = ieee.achievements.filter(achievement => achievements.name === achievement.name)

        if(existingAwards.length > 0 || existingAchievements.length > 0){
            return res.status(409).json({success:false,message:'awards or achievements already exists'})
        }

        if(awards){
            ieee.awards.push(awards)
        }
        if(achievements){
            ieee.achievements.push(achievements)
        }

        await ieee.save()

        res.status(200).json({success:true,message:'IEEE updated'})
    } catch (error) {
        next(error)
    }
}

