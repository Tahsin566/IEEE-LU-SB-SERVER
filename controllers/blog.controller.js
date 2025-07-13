import { Blog } from "../models/blog.model.js"
import slugify from "slugify"
import fs from 'fs'
import { deleteFile, uploadFile, uploadImage } from "../config/cloudinary.js"
import { blogValidator } from "../validator/blog.validator.js"

export const getBlog = async (req, res, next) => {

    try {
        const allBlog = await Blog.find()
        res.json({ success: true, blog: allBlog })

    } catch (error) {
        next(error)
    }

}
export const getApprovedBlog = async (req, res, next) => {

    try {
        const allBlog = await Blog.find({ isApproved: true })

        const trendingBlog = await Blog.aggregate([
            {
                $sort: {
                    createdAt: -1
                }
            },
            {
                $match: {
                    isApproved: true
                }
            },
            {
                $limit: 2
            }
        ])

        const topcategory = await Blog.aggregate([
            {
                $match: {
                    isApproved: true
                }
            },
            {
                $group: {
                    _id: "$category",
                    count: {
                        $sum: 1
                    },
                    
                }
            },
            {
                $sort: {
                    count: -1
                }
            },
            {
                $limit: 3
            }
        ])
        res.json({ success: true, blog: allBlog, trendingBlog, topcategory })

    } catch (error) {
        next(error)
    }

}

export const getSingleBlog = async (req, res, next) => {
    try {
        const blog = await Blog.findById(req.params.id)
        res.status(200).json({ success: true, blog })
    } catch (error) {
        next(error)
    }
}

export const getBlogByCategory = async (req, res, next) => {
    try {
        const blog = await Blog.find({ category: req.params.category,isApproved:true  })
        res.status(200).json({ success: true, blog })
    } catch (error) {
        next(error)
    }
}

export const getBlogByDate = async (req, res, next) => {
    const { order } = req.params
    try {
        if (order === 'Oldest') {
            const blog = await Blog.find({ isApproved: true }, {}, { sort: { createdAt: 1 } })
            return res.status(200).json({ success: true, blog: blog })
        }
        const blog = await Blog.find({ isApproved: true }, {}, { sort: { createdAt: -1 } })
        res.status(200).json({ success: true, blog })
    } catch (error) {
        next(error)
    }
}

export const approveBlog = async (req, res, next) => {
    try {
        const { id } = req.params
        const existingBlog = await Blog.findById(id)
        if (!existingBlog) return res.status(404).json({ success: false, message: 'blog not found' })
        
        if(existingBlog.isApproved === false){
                existingBlog.isApproved = true
        }
        else{
            existingBlog.isApproved = false
        }

        let message = existingBlog.isApproved === true ? 'blog approved' : 'blog rejected'
        await existingBlog.save()
        res.status(200).json({ success: true, message:message })
    }
    catch (error) {
        next(error)
    }
}


export const addBlog = async (req, res, next) => {

    const {

        title,
        author,
        category,
        markdown

    } = req.body

    const isValid = blogValidator(title,author,category)
    if (!isValid) {
        return res.status(400).json({ success: false, message: 'invalid blog' })
    }

    const slug = slugify(title, { lower: true })

    const exitingSlug = await Blog.findOne({ slug })
    if (exitingSlug) {
        return res.status(409).json({ success: false, message: 'blog already exists' })
    }

    if (!(title && author && category && markdown)) {
        return res.status(400).json({ success: false, message: 'all fields are required' })
    }




    try {

        const blogImage = await uploadImage(req?.file?.path) || ''

        const newContent = new Blog({
            title,
            author,
            blogImage: blogImage,
            category,
            markdown,
            slug
        })
        await newContent.save()

        res.json({ success: true, message: 'blog added successfully' })

    } catch (error) {
        next(error)
    }

}

export const updateBlog = async (req, res, next) => {

    const { id, title, author, category, markdown } = req.body
    if (!id) {
        return res.status(400).json({ success: false, message: 'blog id is required' })
    }
    if (!(id && title && author && category && markdown)) {
        return res.status(400).json({ success: false, message: 'all fields are required' })
    }
    try {


        const existingBlog = await Blog.findOneAndUpdate({ _id: id }, { title, author, category, markdown })
        if (!existingBlog) {
            return res.status(404).json({ success: false, message: 'blog not found' })
        }

        if (req?.file) {
            await deleteFile(existingBlog?.blogImage)
            existingBlog.blogImage = await uploadFile(req?.file?.path) || ''
        }

        await existingBlog.save()

        res.status(200).json({ success: true, content: existingBlog })

    } catch (error) {
        if (req?.file) {
            fs.unlinkSync(req?.file?.path)
        }
        next(error)
    }
}

export const deleteBlog = async (req, res, next) => {

    const { id } = req.params
    if (!id) {
        return res.status(400).json({ success: false, message: 'blog id is required' })
    }

    try {
        const existingBlog = await Blog.findOne({ _id: id })
        if (!existingBlog) return res.status(404).json({ success: false, message: 'blog not found' })
        existingBlog.blogImage ? await deleteFile(existingBlog?.blogImage) : null
        await Blog.deleteOne({ _id: id })
        return res.status(200).json({ deleted: true })
    } catch (error) {
        next(error)
    }
}

