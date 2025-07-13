import jwt from 'jsonwebtoken'
import { User } from '../models/user.model.js'

export const protectedRoute = async(req,res,next)=>{

    const {token} = req.cookies

    if(!token) return res.status(401).json({success:false,message:'token not provided'})

    try {
        const decode = jwt.verify(token,process.env.JWT_SECRET)
        const user = await User.findOne({_id:decode._id},{password:false,updatedAt:false,_id:false})
        if(!user) return res.status(404).json({success:false,message:'user not found'})
        req.user = user
        next()
    } catch (error) {
        next(error)
    }

}