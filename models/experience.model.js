
import mongoose from "mongoose";

const ExperienceSchema = new mongoose.Schema({
    title:{
        type:String,
        required:[true,'title is required']
    },
    description:{
        type:String,
        required:[true,'description is required']
    },
    startDate:{
        type:Date,
        required:[true,'start date is required']
    },
    endDate:{
        type:String,
        default:'Present'
    }
    

},{timestamps:true})

export const Experience = mongoose.model('Experience',ExperienceSchema)
