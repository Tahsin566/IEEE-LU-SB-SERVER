

export const researchValidator = (title,author,abstract,department,category,keywords,methodology,status,fundingInfo,email,phonenumber,instituteAddress)=>{
   
    const emailregex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const stringregex = /^[a-zA-Z,. ]$/
    const addressregex = /^[a-zA-Z0-9,. ]$/
    const phoneRegex = /^01[3-9]{1}[0-9]{8}$/

    if(!stringregex.test(title)){
        return {success:false,message:'invalid title'}
    }
    if(!stringregex.test(author)){
        return {success:false,message:'invalid author name'}
    }
    if(!stringregex.test(abstract)){
        return {success:false,message:'invalid abstract'}
    }
    if(!stringregex.test(department)){
        return {success:false,message:'invalid department'}
    }
    if(!stringregex.test(category)){
        return {success:false,message:'invalid category'}
    }
    if(!stringregex.test(keywords)){
        return {success:false,message:'invalid keywords'}
    }
    if(!stringregex.test(methodology)){
        return {success:false,message:'invalid methodology format'}
    }
    if(!stringregex.test(status)){
        return {success:false,message:'invalid status'}
    }
    if(!addressregex.test(instituteAddress)){
        return {success:false,message:'invalid address'}
    }
    if(!emailregex.test(email)){
        return {success:false,message:'invalid email'}
    }
    if(!stringregex.test(fundingInfo)){
        return {success:false,message:'invalid funding info'}
    }
    if(!phoneRegex.test(phonenumber)){
        return {success:false,message:'invalid phone number'}
    }

    return {success:true,message:'Success'}
    

   
}