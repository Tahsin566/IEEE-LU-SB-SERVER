
import mongoose from "mongoose";

const AchievementSchema = new mongoose.Schema({

    title:{
        type:String,
        required:[true,'title is required']
    },
    image:{
        type:String,
        default:''
    },
    description:{
        type:String,
        required:[true,'description is required']
    },
    AchievementType:{
        type:String,
        required:[true,'AchievementType is required']
    },
    year:{
        type:String,
        required:[true,'year is required']
    }

},{timestamps:true})

export const Achievement = mongoose.model('Achievement',AchievementSchema)
