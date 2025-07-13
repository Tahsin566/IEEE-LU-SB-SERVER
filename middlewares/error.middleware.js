

export const Errorhandler = (error,req,res,next)=>{

        
        if (error.name === 'ValidationError') {
            return res.status(400).json({ 
                success: false, 
                message: 'Validation error',
                errors: Object.values(error.errors).map(e => e.message)
            });
        }
        
        if (error.name === 'MongoError') {
            return res.status(500).json({ 
                success: false, 
                message: 'Database error'
            });
        }

        if(error.name === 'CastError'){
            return res.status(400).json({
                success:false,
                message:'Invalid ObjectId'
            })
        }
        if(error.name === 'JsonWebTokenError'){
            return res.status(401).json({
                success:false,
                message:'Invalid token'
            })
        }

        if(error.name === 'TokenExpiredError'){
            return res.status(401).json({
                success:false,
                message:'Token expired'
            })
        }

        if(error.name === "DuplicateKey"){
            return res.status(400).json({
                success:false,
                message:'Duplicate key error'
            })
        }
        

    let message = 'internal server error'
    let status = 500
    console.log(error,error.path);

    return res.status(status).json({success:false,error:error.message || message})

}