const messages=(text,user)=>{
    if(!user)
    user="Anonymous";
    return {
        user,
        text,
        created_at:new Date().getTime()
    }
}

module.exports = messages;