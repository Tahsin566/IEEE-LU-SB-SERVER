
import mongoose from "mongoose";

export const magazineSchema = new mongoose.Schema({
    title:{
        type:String,
        required:[true,'title is required']
    },
    description:{
        type:String,
        required:[true,'description is required']
    },
    author:{
        type:String,
        required:[true,'author is required']
    },
    publicationDate:{
        type:Date,
        default:Date.now()
    },
    category:{
        type:String,
        required:[true,'category is required']
    },
    magazineFile:{
        type:String,
        required:[true,'magazine file is required']
    },
    magazineImage:{
        type:String,
        required:[true,'magazine image is required']
    },
    issueNumber:{
        type:String,
        required:[true,'issue number is required']
    },
    publishedBy:{
        type:String,
        default:'IEEE CS LU SB Chapter'
    },
    volumeNumber:{
        type:String,
        required:[true,'volume number is required']
    }
},{timestamps:true})

export const Magazine = mongoose.model('Magazine',magazineSchema)

