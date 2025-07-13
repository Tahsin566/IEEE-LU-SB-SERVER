
import mongoose from "mongoose";

const ieeeAboutSchema = new mongoose.Schema({

    ActiveMember:{
        type:Number,
        
    },
    image:{
        type:String,
        default:''
    },
    NumberofEvents:{
        type:Number,
        
    },
    awardsWon:{
        type:Number,
        
    },
    numofWorkshop:{
        type:Number,
        
    },
    numofIndustryCollaboration:{
        type:Number,
        
    },
    numofProjectCompleted:{
        type:Number,
        
    }

},{timestamps:true})

export const IEEE = mongoose.model('IEEE',ieeeAboutSchema)
