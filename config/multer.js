
import multer from "multer";

export const filetype = ["image/jpeg","image/png","application/pdf","image/webp"]


const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,"./files")
    },
    filename:(req,file,cb)=>{
        cb(null,Date.now()+"-"+file.originalname)
    }
})


const fileFilter = (req,file,cb)=>{
    if(filetype.includes(file.mimetype)){
        cb(null,true)
    }
    else{
        cb(null,false)
    }
}


export const upload = multer({ storage: storage,limits:{fileSize:1024*1024*5},fileFilter })

