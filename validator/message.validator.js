
export const validateMessage = (name,subject,message,email) => {
    
    const stringRegex = /^[a-zA-Z]+$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const messageRegex = /^[a-zA-Z0-9]+$/;

    if(!stringRegex.test(name)){
        return {success:false,message:'name is invalid'}
    }
    if(!stringRegex.test(subject)){
        return {success:false,message:'subject is invalid'}
    }

    if(!emailRegex.test(email)){
        return {success:false,message:'email is invalid'}
    }

    if(!messageRegex.test(message)){
        return {success:false,message:'message is invalid'}
    }
}