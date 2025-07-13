
export const blogValidator = (title,author,category)=>{
    
    const stringregex = /^[a-zA-Z,. ]$/

    if(!stringregex.test(title)){
        return {success:false,message:'invalid title'}
    }
    if(!stringregex.test(author)){
        return {success:false,message:'invalid author name'}
    }
    if(!stringregex.test(category)){
        return {success:false,message:'invalid category'}
    }
    
    return {success:true,message:'Success'}
    

}
