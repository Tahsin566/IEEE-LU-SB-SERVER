import mongoose from "mongoose";
import {marked} from "marked"
import createDomPurify from "dompurify"
import { JSDOM } from "jsdom"

const dompurify = createDomPurify(new JSDOM().window)

export const newsSchema = new mongoose.Schema({


    title:{
        type:String,
        required:[true,'title is required']
    },
    author:{
        type:String,
        required:[true,'author name is required']
    },
    publicationDate:{
        type:Date,
        default:Date.now()
    },
    authorBio:{
        type:String,
        default:'Author at IEEE Computer Society'
    },
    department:{
        type:String,
        default:'Department of CSE'
    },
    newsImage:{
        type:String,
        required:[true,'image is required']
    },
    category:{
        type:String,
        required:[true,'category is required']
    },
    tags:{
        type:[String],
        default:[]
    },
    markdown:{
        type:String,
        required:[true,'markdown is required']
    },
    htmlContent:{
        type:String,
        default:''
    }
},{timestamps:true})

export const News = mongoose.model('News',newsSchema)

newsSchema.pre('validate',function(next){
    if(this.markdown){
        this.htmlContent = dompurify.sanitize(marked(this.markdown))
    }
    
    next()
})

