import mongoose from "mongoose";


export const researchSchema = new mongoose.Schema({


    title:{
        type:String,
        required:[true,'title is required'],
        unique:true
    },
    author:{
        type:String,
        required:[true,'author name is required']
    },
    department:{
        type:String,
        required:[true,'department is required']
    },
    category:{
        type:String,
        required:[true,'category is required']
    },
    publicationDate:{
        type:Date,
        default:Date.now(),
    },
    abstract:{
        type:String,
        required:[true,'abstract is required']
    },
    keywords:{
        type:String,
        required:[true,'keyword is required']
    },
    methodology:{
        type:String,
        required:[true,'methodology is required']
    },
    institution:{
        type:String,
        default:"Leading University"
    },
    status:{
        type:String,
        enum:['completed','ongoing'],
        default:'ongoing'
    },
    fundingInfo:{
        type:String
    },
    paperFile:{
        type:String,
        required:[true,'file for paper is required']
    },
    paperfileslug:{
        type:String,
        default:"research-paper"
    },
    supportingDocImage:{
        type:String,
        default:""
    },
    email:{
        type:String,
        required:[true,'email is required']
    },
    phonenumber:{
        type:String,
        required:[true,'phone number is required']
    },
    instituteAddress:{
        type:String,
        required:[true,'institute address is required']
    },
    authorId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    isApproved:{
        type:Boolean,
        default:false
    }

},{timestamps:true})

export const Research = mongoose.model('Research',researchSchema)