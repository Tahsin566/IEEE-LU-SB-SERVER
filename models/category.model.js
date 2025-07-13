import mongoose from "mongoose";

const categorySchema = mongoose.Schema({
    name:{
        type:String,
        required:[true,'category name is required']
    },
    type:{
        type:String,
        enum:['general','research','event','time'],
    }
})

export const Category = mongoose.model('Category',categorySchema)