
import mongoose from "mongoose"

const contactSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'name is required']
    },
    subject:{
        type:String,
        required:[true,'subject is required']
    },
    email:{
        type:String,
        required:[true,'email is required']
    },
    message:{
        type:String,
        required:[true,'message is required']
    },
    isRead:{
        type:Boolean,
        default:true
    }
},{timestamps:true})

export const Contact = mongoose.model('Contact',contactSchema)



const faqSchema = new mongoose.Schema({
    email:{
        type:String,
        required:[true,'question is required']
    },
    question:{
        type:String,
        required:[true,'answer is required']
    }
},{timestamps:true})

export const FaqQuery = mongoose.model('FaqQuery',faqSchema)