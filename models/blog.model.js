import mongoose from "mongoose"
import {marked} from "marked"
import createDomPurify from "dompurify"
import { JSDOM } from "jsdom"
import slugify from "slugify"

const dompurify = createDomPurify(new JSDOM().window)

const blogSchema = new mongoose.Schema({

    
    title:{
        type:String,
        required:[true,'title is required']
    },
    author:{
        type:String,
        required:[true,'author name is required']
    },
    slug:{
        type:String,
        unique:true
    },
    authorBio:{
        type:String,
        default:'Author at IEEE Computer Society'
    },
    category:{
        type:String,
        required:[true,'category is required']
    },
    markdown:{
        type:String,
        max:20000,
        min:500,
        required:[true,'markdown is required']
    },
    blogImage:{
        type:String,
        required:[true,'image is required']
    },
    htmlContent:{
        type:String
    },
    memberAuthor:{
        type:String,
        default:"IEEE Member"
    },
    isApproved:{
        type:Boolean,
        default:false
    }

},{timestamps:true})

blogSchema.pre('validate',function(next){

    if(this.markdown){
        this.htmlContent = dompurify.sanitize(marked(this.markdown))
    }
    next()
})

export const Blog = mongoose.model('Blog',blogSchema)