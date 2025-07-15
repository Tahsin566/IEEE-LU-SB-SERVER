
import express from 'express'
import { Committee } from '../models/committee.model.js'
import { protectedRoute } from '../middlewares/auth.middleware.js'
import { adminRoute } from '../middlewares/admin.middleware.js'
import { upload } from '../config/multer.js'
import { deleteFile, uploadFile } from '../config/cloudinary.js'

const router = express.Router()


router.post('/add-committee', protectedRoute, adminRoute,upload.single("image"), async (req, res, next) => {

    console.log(req.body)
    const { name, designation, facebookLink, linkedinLink, id, type } = req.body
    if (!(name && designation && id)) {
        // fs.unlinkSync(req.file?.path)
        return res.status(400).json({ success: false, message: 'all fields are required' })
    }

    const existingMember = await Committee.findOne({ IEEEID: id })

    if (existingMember) {
        existingMember.name = name
        existingMember.designation = designation
        id ? existingMember.IEEEID = id : null
        designation? existingMember.designation = designation : null
        facebookLink ? existingMember.facebook = facebookLink : null
        linkedinLink ? existingMember.linkedin = linkedinLink : null
        type? existingMember.CommitteeMemType = type : null
        

        if (req.file) {
            // fs.unlinkSync(existingMember?.hosted_image)
            existingMember?.hosted_image ? await deleteFile(existingMember?.hosted_image) : null
            existingMember.hosted_image = await uploadFile(req?.file?.path) || ''
        }
        await existingMember.save()

        return res.status(200).json({ success: true, message: 'Updated successfully' })
    }

    try {

        const MemberImage = await uploadFile(req?.file?.path) || ''

        const committee = new Committee({ name, designation, facebook: facebookLink, linkedin: linkedinLink, hosted_image: MemberImage, CommitteeMemType: type,IEEEID:id })
        await committee.save()

        return res.status(201).json({ success: true, message: 'Added successfully' })

    } catch (error) {
        next(error)
    }
})

router.get('/', async (req, res, next) => {


    try {
        const programCoordinator = await Committee.aggregate([
            {
                $match: { designation: 'Program Coordinator' }
            },
            {
                $sort: { rank: 1 }
            }
        ])
        const acmCoordinator = await Committee.aggregate([
            {
                $match: { designation: 'ACM Coordinator' }
            },
            {
                $sort: { rank: 1 }
            }
        ])
        const pulicationsNewsletter = await Committee.aggregate([
            {
                $match: { designation: 'Publications & Newsletter Coordinator' }
            },
            {
                $sort: { rank: 1 }
            }
        ])
        const memberDev = await Committee.aggregate([
            {
                $match: { designation: 'Membership Development Coordinator' }
            },
            {
                $sort: { rank: 1 }
            }
        ])
        const publicity = await Committee.aggregate([
            {
                $match: { designation: 'Publicity Coordinator' }
            },
            {
                $sort: { rank: 1 }
            }
        ])
        const webmaster = await Committee.aggregate([
            {
                $match: { designation: 'Webmaster' }
            },
            {
                $sort: { rank: 1 }
            }
        ])
        const chiefReporting = await Committee.aggregate([
            {
                $match: { designation: 'Chief Reporting Executive' }
            },
            {
                $sort: { rank: 1 }
            }
        ])
        const graphicDesigner = await Committee.aggregate([
            {
                $match: { designation: 'Graphics Design Executive' }
            },
            {
                $sort: { rank: 1 }
            }
        ])
        const photoandVideoExec = await Committee.aggregate([
            {
                $match: { designation: 'Photography and Video Content Executive' }
            },
            {
                $sort: { rank: 1 }
            }
        ])
        const logistics = await Committee.aggregate([
            {
                $match: { designation: 'Logistic Executive' }
            },
            {
                $sort: { rank: 1 }
            }
        ])

        const youthSupport = await Committee.aggregate([
            {
                $match: { designation: 'Youth Support Executive' }
            },
            {
                $sort: { rank: 1 }
            }
        ])


        res.status(200).json({
            success: true,
            programCoordinator,
            acmCoordinator,
            pulicationsNewsletter,
            memberDev,
            publicity,
            webmaster,
            chiefReporting,
            graphicDesigner,
            photoandVideoExec,
            logistics,
            youthSupport,
        })

    } catch (error) {
        next(error)
    }
})

router.get('/advisor', async (req, res, next) => {
    try {
        const advisor = await Committee.find({ CommitteeMemType: 'Advisor' })
        res.status(200).json({ success: true, advisor })
    } catch (error) {
        next(error)
    }
})

router.get('/excom', async (req, res, next) => {
    try {
        const excom = await Committee.find({ CommitteeMemType: 'ExCom' })
        res.status(200).json({ success: true, excom })
    } catch (error) {
        next(error)
    }
})

router.get('/prevExcom', async (req, res, next) => {
    try {
        const prevExcom = await Committee.find({ CommitteeMemType: 'Ex ExCom' })
        res.status(200).json({ success: true, prevExcom })
    }
    catch (error) {
        next(error)
    }
})


router.get('/volunteer', async (req, res, next) => {
    try {
        const volunteer = await Committee.find({ designation: 'Volunteer' })
        res.status(200).json({ success: true, volunteer })
    } catch (error) {
        next(error)
    }
})


router.post('/',protectedRoute,adminRoute,async(req,res,next)=>{

    try {
        const committee = await Committee.insertMany(req.body.members)

        res.status(201).json({success:true,message:'Committee added'})

    } catch (error) {
        next(error)
    }
})

export default router