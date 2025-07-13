import express from 'express'
import { Contact,FaqQuery} from '../models/contact.model.js'
import { validateMessage } from '../validator/message.validator.js'
import { transporter } from '../config/mailconfig.js'
import { protectedRoute } from '../middlewares/auth.middleware.js'
import { adminRoute } from '../middlewares/admin.middleware.js'

const router = express.Router()

router.post('/',async(req,res,next)=>{
    const {name,subject,email,message} = req.body

    const isValidMessage = validateMessage(name,subject,email,message)

    if(!isValidMessage){
        return res.status(400).json({success:false,message:'invalid message'})
    }

    if(!(name && subject && email && message)){
        return res.status(400).json({success:false,message:'all fields are required'})
    }
    try {
        const newContact = new Contact({name,subject,email,message})
        await newContact.save()

        const mailOptions = {
            from:email,
            to: 'nazmulhassantahsin566@gmail.com',
            subject: subject,
            html: `<p>Name: ${name}</p><p>Email: ${email}</p><p>Message: ${message}</p>`
          };

          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });

        res.status(201).json({success:true,message:'Contact added'})
    } catch (error) {
        next(error)
    }
})

router.post('/reply',async(req,res,next)=>{
    const {name,email,subject,message} = req.body
    if(!(email && subject && message)){
        return res.status(400).json({success:false,message:'all fields are required'})
    }

    try {
        const replyMailOptions = {
            from:'nazmulhassantahsin566@gmail.com',
            to:email,
            subject: subject,
            html: name ? `<p>Hi ${name}</p><p>Message: ${message}</p>` :`<p>Message: ${message}</p>`
          };

        if(!replyMailOptions){
            return res.status(400).json({success:false,message:'invalid mail options'})
        }

        transporter.sendMail(replyMailOptions,function(error,info){
          if(error){
              console.log(error)
          }else{
              console.log('Email sent:'+info.response)
          }
        })
        return res.status(200).json({success:true,message:'Reply sent'})
    }
    catch (error) {
        next(error)
    }
})


router.post('/faq-query',async(req,res,next)=>{

    const {email,question} = req.body
    if(!(email && question)){
        return res.status(400).json({success:false,message:'all fields are required'})
    }

    const existingFaq = await FaqQuery.findOne({email,question})
    if(existingFaq){
        return res.status(409).json({success:false,message:'faq query already exists'})
    }
    
    try {
        const newFaq = new FaqQuery({email,question})
        await newFaq.save()
        res.status(201).json({success:true,message:'Faq query added'})
    } catch (error) {
        next(error)
    }

})

router.patch('/:id',protectedRoute,adminRoute,async(req,res,next)=>{
    try {
        const contact = await Contact.findById(req.params.id)
        contact.isRead === true ? contact.isRead = false : contact.isRead = true
        const message = contact.isRead === true ? 'Read' : 'Unread'
        await contact.save()
        res.status(200).json({success:true,message:message})
    }
    catch (error) {
        next(error)
    }
})

router.get('/',async(req,res,next)=>{
    try {
        const contact = await Contact.find({},{createdAt:0,updatedAt:0})
        res.status(200).json({success:true,contact})
    } catch (error) {
        next(error)
    }
})

router.delete('/:id',protectedRoute,adminRoute,async(req,res,next)=>{
    try {
        const contact = await Contact.findById(req.params.id)
        if(!contact){
            return res.status(404).json({success:true,message:'Contact does not exists'})
        }
        await contact.deleteOne()
        return res.status(200).json({success:true,message:'Contact deleted'})
    } catch (error) {
        next(error)
    }
})

export default router