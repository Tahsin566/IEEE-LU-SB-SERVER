
export const adminRoute = (req,res,next)=>{

    try {
        if(req.user?.role !== "admin"){
            return res.status(401).json({success:false,message:'unauthorized'})
        }
        next()
    } catch (error) {
        next(error)
    }
}