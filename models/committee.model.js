import mongoose from "mongoose"

const committeeSchema = new mongoose.Schema({

    name: {
        type: String,
        required: [true, 'name is required']
    },
    designation: {
        type: String,
        required: [true, 'designation is required']
    },
    IEEEID: {
        type: String,
        default: ''
    },
    rank: {
        type: Number,
        default: 0
    },
    image: {
        type: String,
        default: ''
    },
    hosted_image: {
        type: String,
        default: ''
    },
    department: {
        type: String,
        default: 'Computer Science and Engineering'
    },
    CommitteeMemType: {
        type: String,
        default: 'Member'
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    facebook: {
        type: String,
        default: ''
    },
    linkedin: {
        type: String,
        default: ''
    },
    duration: {
        type: String,
        default: '2025-2026'
    },


}, { timestamps: true })

export const Committee = mongoose.model('Committee', committeeSchema)
