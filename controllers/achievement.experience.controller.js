
import { Experience } from "../models/experience.model.js"
import { Achievement } from "../models/achievement.model.js"
import { User } from "../models/user.model.js"
import { uploadFile } from "../config/cloudinary.js"
import { Committee } from "../models/committee.model.js"

export const addExperience = async (req, res, next) => {

    try {
        const { name, IEEEID, title, description, facebook, linkedin, startDate, endDate } = req.body


        const existingComittee = await Committee.findOne({ name: name, IEEEID })
        const existingVolunteer = await Committee.findOne({ name, IEEEID, CommitteeMemType: 'Volunteer' })


        if (existingComittee && existingComittee.CommitteeMemType === "Member" && title !== "Volunteer") {
            return res.status(409).json({ success: false, message: 'member already exists' })
        }
        if (existingComittee && existingComittee.CommitteeMemType === "ExCom") {
            return res.status(409).json({ success: false, message: 'member already exists' })
        }


        const experience = new Experience({ title, description, startDate, endDate: endDate || new Date(Date.now()) })
        await experience.save()

        const existingUser = await User.findOne({ IEEEID: IEEEID })

        if (!existingUser) {
            return res.status(409).json({ success: false, message: 'user does not exists' })
        }

        existingUser.experiences.push(experience._id)
        await existingUser.save()


        if (existingVolunteer) {
            return res.status(200).json({ success: true, message: 'volunteer experience added' })
        }


        const Excom = ["Chairperson", "Vice Chairperson", "Secretary", "Treasurer"]

        let newMember

        if (Excom.includes(title)) {
            newMember = new Committee({
                name: name,
                IEEEID,
                designation: title,
                CommitteeMemType: 'ExCom',
                facebook: existingUser.facebook ? existingUser.facebook : facebook,
                linkedin: existingUser.linkedin ? existingUser.linkedin : linkedin,
                user: existingUser._id,
                hosted_image: existingUser?.profilePicture
            })
        } else if (title === 'Volunteer') {
            newMember = new Committee({
                name: name,
                IEEEID,
                designation: title,
                CommitteeMemType: 'Volunteer',
                facebook: existingUser.facebook ? existingUser.facebook : facebook,
                linkedin: existingUser.linkedin ? existingUser.linkedin : linkedin,
                user: existingUser._id,
                hosted_image: existingUser?.profilePicture
            })
        }
        else {
            newMember = new Committee({
                name: name,
                IEEEID,
                designation: title,
                rank: name?.includes("Tahsin") ? 122 : 0,
                CommitteeMemType: 'Member',
                facebook: existingUser.facebook ? existingUser.facebook : facebook,
                linkedin: existingUser.linkedin ? existingUser.linkedin : linkedin,
                user: existingUser._id,
                hosted_image: existingUser?.profilePicture
            })
        }
        await newMember.save()


        res.status(201).json({ success: true, message: 'Experience added' })
    } catch (error) {
        next(error)
    }
}

export const addAchievement = async (req, res, next) => {

    const { title, description, year, AchievementType } = req.body

    const existingAchievement = await Achievement.findOne({ title })
    if (existingAchievement) {
        return res.status(409).json({ success: false, message: 'Achievement already exists' })
    }
    try {
        const image = req.file?.path ? await uploadFile(req?.file?.path) : null
        const achievements = new Achievement({ title, description, image, AchievementType, year })
        await achievements.save()

        const existingUser = await User.findOne({ email: req.user.email })

        if (achievements.AchievementType === 'Individual Awards') {
            existingUser.achievements.push(achievements._id)
        }

        await existingUser.save()

        res.status(201).json({ success: true, message: 'Achievement added' })
    } catch (error) {
        next(error)
    }
}

export const assignAchievementToUser = async (req, res, next) => {
    const { IEEEID, achievementsId } = req.body

    try {

        const user = await User.findOne({ IEEEID })

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' })
        }


        const existingAchievements = user.achievements.filter((e) => e?.toString() === achievementsId)

        if (existingAchievements.length > 0) {
            return res.status(409).json({ success: false, message: 'achievements already exists' })
        }

        if (achievementsId) {
            user.achievements.push(achievementsId)
        }
        await user.save()

        res.status(200).json({ success: true, message: 'User updated' })
    } catch (error) {
        next(error)
    }
}

export const deleteAchievement = async (req, res, next) => {
    const { id } = req.params
    if (!id) {
        return res.status(400).json({ success: false, message: 'achievement id is required' })
    }
    try {
        const achievements = await Achievement.findByIdAndDelete(id)
        res.status(200).json({ success: true, message: 'Achievement deleted' })
    }
    catch (error) {
        next(error)
    }
}

export const getAchievements = async (req, res, next) => {
    try {
        const achievements = await Achievement.find({ AchievementType: { $ne: 'Individual Awards' } })
        res.status(200).json({ success: true, achievements })
    } catch (error) {
        next(error)
    }
}
