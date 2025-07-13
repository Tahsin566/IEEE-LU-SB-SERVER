import { User } from "../models/user.model.js"
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { authValidator } from "../validator/auth.validator.js"
import { Achievement } from "../models/achievement.model.js"
import { Experience } from "../models/experience.model.js"
import { deleteFile, uploadFile } from "../config/cloudinary.js"
import fs from "fs"
import { Committee } from "../models/committee.model.js"
import { transporter } from "../config/mailconfig.js"

export const signUp = async (req, res, next) => {

    const { username, email, password, IEEEID, memberType } = req.body

    console.log('hello')
    

    if (!(username && email && password && IEEEID && memberType)) {
        return res.status(400).json({ success: false, message: 'all fields are required' })
    }
    const user = await User.findOne({ email }, { createdAt: false, updatedAt: false })
    const ismember = await User.findOne({ IEEEID }, { createdAt: false, updatedAt: false })
    if (user) {
        return res.status(409).json({ success: false, message: 'email already exists' })
    }
    if (ismember) {
        return res.status(409).json({ success: false, message: 'IEEE ID already exists' })
    }

    const isValid = authValidator(username, email, IEEEID, memberType)

    if (!isValid.success) {
        return res.status(400).json({ success: false, message: isValid.message })
    }



    try {


        const hashpassword = await bcrypt.hash(password, 10)

        const newUser = new User({ username, password: hashpassword, email, IEEEID, memberType })
        await newUser.save()

        const token = await jwt.sign({ _id: newUser._id, email: newUser.email }, process.env.JWT_SECRET, { expiresIn: "7d" })

        newUser._id = undefined
        newUser.password = undefined
        newUser.createdAt = undefined
        newUser.updatedAt = undefined

        return res.cookie('token', token, { sameSite: "none", secure: false, maxAge: 7 * 24 * 60 * 60 * 1000, httpOnly: true }).json({ success: true, user: newUser, token })

    } catch (error) {
        next(error)
    }


}


export const signIn = async (req, res, next) => {

    const { email, password, IEEEID } = req.body
    const user = await User.findOne({ email }, { createdAt: false, updatedAt: false })

    if (!user) {
        return res.status(404).json({ message: 'user does not exists' })
    }
    try {



        if (user?.IEEEID !== IEEEID) {
            return res.status(401).json({ success: false, message: 'IEEE ID does not match' })
        }


        if (user && await bcrypt.compare(password, user.password)) {


            const token = await jwt.sign({ _id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "7d" })

            user._id = undefined
            user.password = undefined

            return res.cookie('token', token, { sameSite: 'none', secure: false, maxAge: 7 * 24 * 60 * 60 * 1000, httpOnly: true })
                .json({ success: true, user: user, token })

        }

        res.json({ success: false, message: 'incorrect password' })


    } catch (error) {
        next(error)
    }
}



export const signOut = (req, res, next) => {
    try {
        const { token } = req.cookies


        if (!token) return res.status(401).json({ success: false, message: 'token not found' })


        res.clearCookie('token', { sameSite: "lax", secure: false, httpOnly: true })
        res.status(200).json({ success: true, message: 'logged out successfully' })
    } catch (error) {
        next(error)
    }
}

export const uploadProfilePicture = async (req, res, next) => {

    const { user } = req
    const existingUser = await User.findOne({ email: user?.email })
    if (!existingUser) {
        // fs.unlinkSync(req?.file?.path)
        return res.status(404).json({ success: false, message: 'user not found' })
    }

    try {
        if (existingUser.profilePicture) {
            await deleteFile(existingUser.profilePicture)
        }
        const profilePicture = await uploadFile(req?.file?.path) || ''
        existingUser.profilePicture = profilePicture
        await existingUser.save()

        const existingComittee = await Committee.findOne({ IEEEID: user?.IEEEID })
        if (existingComittee) {
            existingComittee.hosted_image = profilePicture
            await existingComittee?.save()
        }

        res.status(200).json({ success: true, message: 'profile picture uploaded successfully' })
    }
    catch (error) {
        fs.unlinkSync(req?.file?.path)
        next(error)
    }
}

export const getProfile = async (req, res, next) => {

    try {
        const user = await User.findOne({ email: req?.user?.email }, { updatedAt: false, password: false })
        if (!user) {
            console.log(user)
            return res.status(404).json({ success: false, message: 'user not found' })

        }
        const achievements = await Achievement.find({ _id: { $in: user.achievements } })
        user.achievements = achievements

        const experiences = await Experience.find({ _id: { $in: user.experiences } })
        user.experiences = experiences

        res.status(200).json({ success: true, user: user })
    } catch (error) {
        next(error)
    }
}



export const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find({}, { createdAt: false, updatedAt: false, password: false, _id: false })
        res.status(200).json({ success: true, users: users })
    } catch (error) {
        next(error)
    }
}

export const getUserProfile = async (req, res, next) => {
    try {
        const user = await User.findOne({ IEEEID: req.params.id }, { updatedAt: false, password: false, _id: false })
        if (!user) {
            return res.status(404).json({ success: false, message: 'user not found' })
        }
        const achievements = await Achievement.find({ _id: { $in: user.achievements } })
        user.achievements = achievements

        const experiences = await Experience.find({ _id: { $in: user.experiences } })
        user.experiences = experiences
        res.status(200).json({ success: true, user: user })
    } catch (error) {
        next(error)
    }
}

export const resetPassword = async (req, res, next) => {

    const { email, oldPassword, newPassword } = req.body

    const existingUser = await User.findOne({ email })

    if (!existingUser) {
        return res.json({ success: false, message: "User not found" })
    }

    try {
        if (existingUser && await bcrypt.compare(oldPassword, existingUser.password)) {
            existingUser.password = await bcrypt.hash(newPassword, 10)
            await existingUser.save()
            return res.json({ success: true, message: 'Password updated' })
        }
        res.json({ success: false, message: 'Failed to update password' })

    } catch (error) {
        next(error)
    }
}

export const addSocialLinks = async (req, res, next) => {

    const { email, facebook, linkedin } = req.body


    const foundUser = await User.findOne({ email: email })

    if (!foundUser) {
        return res.json({ success: false, message: "User not found" })
    }

    try {

        if (facebook) {
            foundUser.userfacebook = facebook
        }

        if (linkedin) {
            foundUser.userlinkedin = linkedin
        }

        await foundUser.save()

        res.json({ success: true, message: "Updated successfully" })
    } catch (error) {
        next(error)
    }
}

export const sendOtp = async(req,res,next)=>{

    const {email,username} = req.body

    const user = await User.findOne({email})

    if(!user){
        return res.json({ success: false, message: "User not found" })
    }

    try {


        
    } catch (error) {
        
    }
}

export const ChangePassByAdmin = async (req, res, next) => {

    const { email, newPassword } = req.body

    const existingUser = await User.findOne({ email })

    if (!existingUser) {
        return res.json({ success: false, message: "User not found" })
    }

    try {

        existingUser.password = await bcrypt.hash(newPassword, 10)
        await existingUser.save()
        return res.json({ success: true, message: 'Password changed' })

    } catch (error) {
        next(error)
    }

}



