
import { v2 as cloudinary } from 'cloudinary'
import dotenv from 'dotenv'
import sharp from 'sharp'
dotenv.config()



cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})


export const uploadFile = async (file) => {
    if(!file){
        console.log("No file provided")
        return
    }
    try {

        const uploadResult = await cloudinary.uploader.upload(file,{allowed_formats:["jpg","png","pdf","webp"],folder:'IEEE'})
        console.log("Uploaded successfully and url is ",uploadResult.secure_url)
        return uploadResult.secure_url

    } catch (error) {
        console.log("an error occurred --", error)
    }
}


export const uploadImage = async (file,quality=10) => {
    if(!file){
        console.log("No file provided")
        return
    }
    
    const filename = file?.split(".")[0]+".webp"
    const jpgfilename = file?.split(".")[0]+".jpg"
    const pngfilename = file?.split(".")[0]+".png"
    const webpfilename = file?.split(".")[0]+".webp"
    
    
    
    await sharp(file).webp({quality:quality,lossless:true}).toFile(filename)
    
    try {

        const uploadResult = await cloudinary.uploader.upload(filename,{allowed_formats:['webp','jpg','png'],folder:'IEEE'})
        console.log("Uploaded successfully and url is ",uploadResult.secure_url)
        return uploadResult.secure_url

    } catch (error) {
        console.log("an error occurred --", error)
    }
}



export const deleteFile = async (file) => {
    if(!file){
        console.log("No file provided")
        return false
    }
    try {
        const publicId = file?.split("/")?.pop()?.split(".")[0]
        const deleteResult = await cloudinary.uploader.destroy(`IEEE/${publicId}`)
        console.log("Deleted successfully and result is ",deleteResult)
        return true
    } catch (error) {
        console.log("an error occurred --", error)
        return false
    }
}






