export const newsValidator = (title,author,tags,category)=>{
    
    const stringregex = /^[a-zA-Z,. ]$/

    if(!stringregex.test(title)){
        return {success:false,message:'invalid title'}
    }
    if(!stringregex.test(author)){
        return {success:false,message:'invalid author'}
    }
    if(!stringregex.test(category)){
        return {success:false,message:'invalid category'}
    }
    tags.foreach((tag)=>{
        if(!stringregex.test(tag)){
            return {success:false,message:'invalid tag'}
        }
    })
    
    return {success:true,message:'Success'}
}