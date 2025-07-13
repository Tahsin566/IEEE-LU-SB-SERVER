
import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema({
    title:{
        type:String,
        default:""
    },
    description:{
        type:String,
        default:""
    },
    bannerType:{
        type:String,
        required:[true,"banner type is required"]
      
    },
    image:{
        type:String,
        required:[true,"banner image is required"]
    }
})

export const Banner = mongoose.model("Banner",bannerSchema)