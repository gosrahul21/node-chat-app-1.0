const users=[]

//add user, remove user, get user, getusersInRoom

const addUser= ({id,username,room})=>{
    //clean the data
    username =username.trim().toLowerCase();
    room = room.trim().toLowerCase();
    //validate the data
    
    if(!room||!username){
        return {
            error:'Username and room are required'
        }
    
    }
    // check for existing user

    const existingUser = users.find((user)=>{
        return user.room===room&&user.username===username

    });

    //validate username
    console.log(existingUser)
    if(existingUser)
    {
        return {
            error:"username is in use!"
        }
    }

    // store user
    const user = {id,username, room}
    users.push(user);
    return {user};

}


const removeUser=(id)=>{
    const index= users.findIndex((user)=>{
        return user.id===id;
    });

    if(index!=-1) //we found a match
    {
        return users.splice(index,1)[0]; //delete item at that index             
    }
}


const getUser=(id)=>{
    return users.find((user)=>{
        return user.id===id;
    })
}


const getusersInRoom=(room)=>{
    return users.filter((user)=>{
        return user.room===room;
    });
}

// let ob={
//     id:32,
//     username:"rahul",
//     room:'sahibganj'
// }

// addUser(ob);
// //console.log(users);

// ob={
//     id:44,
//     username:"rahufd",
//     room:'sahibganj'
// }

// addUser({
//     id:44,
//     username:"rahufd",
//     room:'patna'
// })
// console.log(addUser(ob));
//console.log(users);
// console.log(removeUser(44));
// console.log(users);

console.log(getusersInRoom('patna').length);



module.exports={
    addUser,
    getUser,
    getusersInRoom,
    removeUser
};