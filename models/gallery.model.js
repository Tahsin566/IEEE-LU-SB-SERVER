
import mongoose from "mongoose";

const GallerySchema = new mongoose.Schema({
    image:{
        type:String,
        required:[true,'image is required']
    },
    caption:{
        type:String,
        default:''
    }
},{timestamps:true})

export const Gallery = mongoose.model('Gallery',GallerySchema)
