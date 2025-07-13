
import mongoose from "mongoose"

const faqSchema = new mongoose.Schema({
    category:{
        type:String,
        required:[true,'category is required']
    },
    question:{
        type:String,
        required:[true,'question is required']
    },
    answer:{
        type:String,
        required:[true,'answer is required']
    }
},{timestamps:true})

export const Faq = mongoose.model('FAQ',faqSchema)
