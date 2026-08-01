import { PresentationSlide } from "../models/presentation.slide.model.js"

export const getAllPresentation = async (req, res, next) => {

    try {
        const presentationSlide = await PresentationSlide.find({}, {}, { sort: { createdAt: -1 } })
        res.status(200).json({ success: true, slides: presentationSlide })
    } catch (error) {
        next(error)
    }
}

export const addPresentation = async (req, res, next) => {

    try {

        const body = req.body
        console.log(req.file.path)

        const newPresentationSlide = new PresentationSlide({
            title: body.title,
            description: body.description,
            drivelink: body.drivelink,
            date: body.date,
            time: body.time,
            isFeatured: body.isFeatured || false,
            category: body.category,
            slideType: body.type,
            speakerName: body.speakerName,
            speakerDesignation: body.speakerDesignation,
            speakerOrg : body.speakerOrganization,
            location : body.location,
            thumbnail : await uploadFile(req.file?.path) || '',

        })
        newPresentationSlide.save()

        res.json({msg:'Presentation Slide Route'});

    } catch (error) {
        next(error)
    }
}