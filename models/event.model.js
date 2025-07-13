import mongoose from "mongoose";

const EventSchema = new mongoose.Schema({

    name:{
        type:String,
        required:[true,'name is required']
    },
    description:{
        type:String,
        required:[true,'description is required']
    },
    image:{
        type:String,
        required:[true,'image is required']
    },
    startdate:{
        type:Date,
        default:Date.now()
    },
    time:{
        type:String,
        required:[true,'time is required']
    },
    location:{
        type:String,
        required:[true,'location is required']
    },
    isFeatured:{
        type:Boolean,
        default:false
    },
    status:{
        type:String,
        enum:['upcoming','ongoing','completed','cancelled'],
        default:'upcoming'
    },
    type:{
        type:String,
        enum:['technical','workshop','social','meeting','webinar']
    },
    registrationLink:{
        type:String,
        default:''
    }
},{timestamps:true})

export const Event = mongoose.model('Event',EventSchema)



