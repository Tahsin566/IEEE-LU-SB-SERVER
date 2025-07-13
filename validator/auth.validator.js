
export const authValidator = (username,email,IEEEID,memberType)=>{
    
    const emailregex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    const localregex = /^lm\d{5,}$/

    const usernameregex = /^[a-zA-Z ]{4,}[0-9]{0,}$/

    const IEEEIDregex = memberType?.toLowerCase()?.trim() === 'local' ? localregex : /^[0-9]+$/
    if(!(usernameregex.test(username))){
        return {success:false,message:'username can contain only alphabets and numbers and must be atleast 3 characters long'}
    }
    if(!(emailregex.test(email))){
        return {success:false,message:'invalid email'}
    }
    if(!(IEEEIDregex.test(IEEEID))){
        return {success:false,message:`invalid ${memberType?.toLowerCase()} IEEE ID, ${memberType?.toLowerCase()==="local" ? 'IEEE ID must be of 6 digits and start with lm': 'IEEE ID must be a number'}`}
    }
    return {success:true,message:'Success'}
}
