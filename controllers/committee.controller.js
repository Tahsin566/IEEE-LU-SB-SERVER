import { Committee } from "../models/committee.model.js"
import { Experience } from "../models/experience.model.js"


export const addCommitee = async (req, res, next) => {

    const { name, designation, facebookLink, linkedinLink, id, type } = req.body
    if (!(name && designation && id)) {
        // fs.unlinkSync(req.file?.path)
        return res.status(400).json({ success: false, message: 'all fields are required' })
    }

    const existingMember = await Committee.findOne({ IEEEID: id ,name})

    const comm_designation = existingMember.designation


    if (existingMember) {

        name ? existingMember.name = name : null
        designation ? existingMember.designation = designation : null
        id ? existingMember.IEEEID = id : null
        designation ? existingMember.designation = designation : null
        facebookLink ? existingMember.facebook = facebookLink : null
        linkedinLink ? existingMember.linkedin = linkedinLink : null
        type ? existingMember.CommitteeMemType = type : null


        if (req.file) {
            // fs.unlinkSync(existingMember?.hosted_image)
            existingMember?.hosted_image ? await deleteFile(existingMember?.hosted_image) : null
            existingMember.hosted_image = await uploadFile(req?.file?.path) || ''
        }
        await existingMember?.save()

        console.log(type)

        if (type === 'Ex ExCom') {
            const existingExp = await Experience.find({ title :existingMember?.designation, ieeeId: existingMember?.IEEEID })
            if (existingExp) {
                existingExp.forEach(async (exp) => {
                    exp.title = `Former ${existingMember?.designation}` 
                    exp.description = `Former ${existingMember?.designation} at IEEE CS LU SB Chapter `
                    await exp?.save()
                })
            }
        
        }
        else if(type === 'ExCom'){
            console.log('hit')
            const existingExp = await Experience.find({ title : `Former ${designation}`, ieeeId: id })
            if (existingExp) {
                existingExp.forEach(async (exp) => {
                    exp.title = `${designation}`
                    exp.description = `${designation} at IEEE CS LU SB Chapter `
                    await exp?.save()
                })
            }
        }
        else{
            const existingExp = await Experience.find({ title : comm_designation, ieeeId: existingMember?.IEEEID })
            if (existingExp) {
                existingExp.forEach(async (exp) => {
                    exp.title = existingMember?.designation
                    exp.description = `${existingMember?.designation} at IEEE CS LU SB Chapter `
                    await exp?.save()
                })
            }
        }
        
        return res.status(200).json({ success: true, message: 'Updated successfully' })
    }

    try {

        const MemberImage = await uploadFile(req?.file?.path) || ''

        const committee = new Committee({ name, designation, facebook: facebookLink, linkedin: linkedinLink, hosted_image: MemberImage, CommitteeMemType: type, IEEEID: id })
        console.log("Saved")
        await committee.save()

        return res.status(201).json({ success: true, message: 'Added successfully' })

    } catch (error) {
        next(error)
    }
}


export const getExtendedCommittee = async (req, res, next) => {


    try {

        const allmembers = await Committee.find({ CommitteeMemType: 'Member' }, { user: 0, updatedAt: 0, department: 0 }, { sort: { rank: 1 } })

        const programCoordinator = allmembers.filter((member) => member.designation === 'Program Coordinator')
        const acmCoordinator = allmembers.filter((member) => member.designation === 'ACM Coordinator')
        const pulicationsNewsletter = allmembers.filter((member) => member.designation === 'Publications & Newsletter Coordinator')
        const memberDev = allmembers.filter((member) => member.designation === 'Membership Development Coordinator')
        const publicity = allmembers.filter((member) => member.designation === 'Publicity Coordinator')
        const webmaster = allmembers.filter((member) => member.designation === 'Webmaster')
        const chiefReporting = allmembers.filter((member) => member.designation === 'Chief Reporting Executive')
        const graphicDesigner = allmembers.filter((member) => member.designation === 'Graphics Design Executive')
        const photoandVideoExec = allmembers.filter((member) => member.designation === 'Photography and Video Content Executive')
        const logistics = allmembers.filter((member) => member.designation === 'Logistic Executive')
        const youthSupport = allmembers.filter((member) => member.designation === 'Youth Support Executive')

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
}

export const getCommittee = async (req, res, next) => {
    try {

        //i need to get members that do not have designation as volunteer and member type as Advisory panel

        const allmembers = await Committee.aggregate([
            { $match: { designation: { $ne: 'Volunteer' } } },
            { $match: { CommitteeMemType: { $ne: 'Advisory Panel' } } },
            { $match: { designation: { $ne: 'Youth Support Executive' } } },
            { $sort: { rank: 1 } }
        ])
        res.status(200).json({ success: true, allmembers })
    } catch (error) {
        next(error)
    }
}

export const getAdvisor = async (req, res, next) => {
    try {
        const advisor = await Committee.find({ CommitteeMemType: 'Advisory Panel' })
        res.status(200).json({ success: true, advisor })
    } catch (error) {
        next(error)
    }
}

export const getExCom = async (req, res, next) => {
    try {
        const excom = await Committee.find({ CommitteeMemType: 'ExCom' }, {}, { sort: { createdAt:1 } })
        res.status(200).json({ success: true, excom })
    } catch (error) {
        next(error)
    }
}

export const getPrevExCom = async (req, res, next) => {
    try {
        const prevExcom = await Committee.find({ CommitteeMemType: 'Ex ExCom' }, {}, { sort: { createdAt: 1 } })
        res.status(200).json({ success: true, prevExcom })
    }
    catch (error) {
        next(error)
    }
}

export const getVolunteer = async (req, res, next) => {
    try {
        const volunteer = await Committee.find({ designation: 'Volunteer' })
        res.status(200).json({ success: true, volunteer })
    } catch (error) {
        next(error)
    }
}

export const addCommitteeMembers = async (req, res, next) => {

    try {
        const committee = await Committee.insertMany(req.body.members)

        res.status(201).json({ success: true, message: 'Committee added' })

    } catch (error) {
        next(error)
    }
}

export const removeFromCommittee = async (req, res, next) => {
    try {

        const existingMember = await Committee.findById(req.params.id)

        const existingExp = await Experience.find({ title: existingMember?.designation, ieeeId: existingMember?.IEEEID })

        if(existingExp){
            existingExp.forEach(async (exp) => {
                exp.title = `Former ${existingMember?.designation}` 
                exp.description = `Former ${existingMember?.designation} at IEEE CS LU SB Chapter `
                await exp?.save()
            })
        }
        await Committee.deleteOne({ _id: req.params.id })

        res.status(200).json({ success: true, message: 'Committee deleted' })
    } catch (error) {
        next(error)
    }
}


