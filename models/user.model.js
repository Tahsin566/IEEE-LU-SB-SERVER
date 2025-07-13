import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({

    username:{
        type:String,
        required:[true,'username is required']
    },
    email:{
        type:String,
        required:[true,'email is required'],
        unique:true,
        lowercase:true,
        trim:true
    },
    password:{
        type:String,
        required:[true,'password is required']
    },
    role:{
        type:String,
        enum:['user','admin'],
        default:'user'
    },
    userfacebook:{
        type:String,
        default:''   
    },
    userlinkedin:{
        type:String,
        default:''   
    },
    achievements:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Achievement'
    }],
    experiences:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Experience'
    }],
    memberType:{
        type:String,
        enum:['local','global'],
        default:'local'
    },
    IEEEID:{
        type:String,
        required:[true,'IEEE ID is required']
    },
    department:{
        type:String,
        default:'Computer Science and Engineering'
    },
    university:{
        type:String,
        default:'Leading University'
    },
    profilePicture:{
        type:String,
        default:''    
    }
},{timestamps:true})

export const User = mongoose.model('User',UserSchema)



