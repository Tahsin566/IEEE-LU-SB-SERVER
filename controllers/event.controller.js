
import { deleteFile, uploadFile } from "../config/cloudinary.js"
import { Event } from "../models/event.model.js"
import { User } from "../models/user.model.js"
import fs from 'fs'


export const getAllEvent = async (req, res, next) => {
    try {
        const allEvent = await Event.find({})
        const getallTypes = await Event.aggregate([
            {
                $group: {
                    _id: "$type",
                    count: {
                        $sum: 1
                    }
                }
            },

        ])

        res.status(200).json({ success: true, event: allEvent, types: getallTypes })

    } catch (error) {
        next(error)
    }
}


export const getEventsByDate = async (req, res, next) => {

    const { startDate } = req.body
    if (!startDate) {
        return res.status(400).json({ success: false, message: 'start date is required' })
    }
    const endDate = new Date(startDate)
    endDate.setDate(endDate?.getDate() + 7);
    const enddate = `${endDate?.getFullYear()}-${endDate?.getMonth() + 1}-${endDate?.getDate()}`

    try {

        const events = await Event.find({
            startdate: {
                $gte: new Date(startDate)?.setHours(0, 0, 0, 0),
                $lte: new Date(enddate)?.setHours(23, 59, 59, 999)
            },
            


        })
        res.status(200).json({ success: true, event: events })

    } catch (error) {
        next(error)
    }
}



export const getUpcomingEventDetailsImageAndCountDown = async (req, res, next) => {
    try {
        const upcomingEvents = await Event.aggregate([
            {
                $match: { status: 'upcoming' }
            },
            {
                $sort: { startdate: 1 }
            },
            {
                $limit: 1
            }
        ])

        const timeString = upcomingEvents[0]?.time;
        const [hours, minutes] = timeString ? timeString?.split(':')?.map(Number) : [0,0]
        const extraTime = (hours * 3600000) + (minutes * 60000);

        const milliseconds = new Date(upcomingEvents[0]?.startdate).getTime() - new Date()?.getTime() + extraTime

        if (milliseconds < 0) {
            return res.status(200).json({ success: true, event: upcomingEvents[0], millisecondsleft: null })
        }

        res.status(200).json({ success: true, event: upcomingEvents[0], millisecondsleft: milliseconds })
    } catch (error) {
        next(error)
    }
}

export const getFeaturedEvents = async (req, res, next) => {
    try {
        const featuredEvents = await Event.find({ isFeatured: true }).limit(1)
        res.status(200).json({ success: true, event: featuredEvents[0] })
    } catch (error) {
        next(error)
    }
}

export const getEventByCategory = async (req, res, next) => {
    try {
        const { category } = req.params
        const events = await Event.find({ type: category })
        res.status(200).json({ success: true, event: events })
    } catch (error) {
        next(error)
    }
}

export const getsingleEvent = async (req, res, next) => {
    try {
        const event = await Event.findById(req.params.id)
        res.status(200).json({ success: true, event })
    } catch (error) {
        next(error)
    }
}


export const addEvent = async (req, res, next) => {


    const {
        name,
        description,
        startdate,
        time,
        location,
        isFeatured,
        status,
        type,
        registrationLink
    } = req.body

    //event already exists
    const existingEvent = await Event.findOne({ name: name })

    if (existingEvent) {

        return res.status(409).json({ success: false, message: 'event already exists' })

    }

    if (!(name && description && time && location)) {
        return res.status(400).json({ success: false, message: 'all fields are required' })
    }


    try {

        const eventImage = await uploadFile(req?.file?.path)

        const newEvent = new Event({
            name,
            description,
            startdate,
            time,
            location,
            isFeatured,
            status,
            image: eventImage,
            type,
            registrationLink
        })

        await newEvent.save()

        res.status(201).json({ success: true, message: 'Event added' })
    } catch (error) {
        next(error)

    }
}



export const updateEvent = async (req, res, next) => {
    const { id, name, description, startdate, time, location, isFeatured, status, type, registrationLink } = req.body
    if (!id) {
        return res.status(400).json({ success: false, message: 'event id is required' })
    }
    if (!(id && name && description && time && location && isFeatured && status && type && registrationLink)) {
        return res.status(400).json({ success: false, message: 'all fields are required' })
    }
    try {
        const existingEvent = await Event.findById(id)
        if (!existingEvent) {
            return res.status(404).json({ success: false, message: 'event not found' })
        }
        existingEvent.name = name
        existingEvent.description = description
        existingEvent.startdate = startdate
        existingEvent.time = time
        existingEvent.location = location
        existingEvent.isFeatured = isFeatured
        existingEvent.status = status
        existingEvent.type = type
        existingEvent.registrationLink = registrationLink

        if (req.file) {
           await deleteFile(existingEvent?.image)
           existingEvent.image = await uploadFile(req?.file?.path)
        }

        await existingEvent.save()

        res.status(200).json({ success: true, event: existingEvent })
    } catch (error) {
        next(error)
    }
}

export const deleteEvent = async (req, res, next) => {
    const { id } = req.params
    if (!id) {
        return res.status(400).json({ success: false, message: 'event id is required' })
    }
    try {
        const existingEvent = await Event.findOne({ _id: id })
        if (!existingEvent) return res.status(404).json({ success: false, message: 'event not found' })

        existingEvent.image ? await deleteFile(existingEvent?.image) : null
        await Event.deleteOne({ _id: id })
        return res.status(200).json({ deleted: true })
    } catch (error) {
        next(error)
    }
}



