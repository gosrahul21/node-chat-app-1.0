const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const express =require('express');
const app=express();
const message_text = require('./utils/messages');
const Filter = require('bad-words');
const { callbackify } = require('util');
const {
    addUser,
    getUser,
    getusersInRoom,
    removeUser
} = require('./utils/user');
const server = http.createServer(app); //if we dont do this express do this behid
const io = socketio(server);

const port =process.env.PORT||3000;
const publicDirectoryPath = path.join(__dirname,'../public');
app.use(express.static(publicDirectoryPath));

let count=0;
io.on('connection',(socket)=>{
     console.log("new websocket connection");
    // socket.emit('countUpdated',count)
    // socket.on('increment',()=>{
    //     count++;
    //    // socket.emit('countUpdated',count);
    //    io.emit('countUpdated',count);//emit  the event to all connection
//})
    // socket.emit('message',message_text("welcome"));
    // socket.broadcast.emit('message',message_text('a new user has joined'));  
    




    socket.on('join',({username,room},cb)=>{
        //use method by socket to join a given chat room
        const {error,user}=addUser({id:socket.id,username,room});
        //const {error,user} =addUser({id:socked.id,...options});  
        //when callback parameter is options object not destructured .as we did in mongodb
        
        if(error){
            return cb(error);
        }
        
        socket.join(user.room);
        console.log(username);
        socket.emit('message',message_text("welcome",user.username));
        socket.broadcast.to(user.room).emit('message',message_text(`${user.username} has joined`,"Chat App"));  
        io.to(user.room).emit('roomData',{
            room:user.room,
            users:getusersInRoom(user.room)
        });

        //socket.emit,io.emit,socket.broadcast.emit
        //io.to.emit -- it allows to send message in everyone in a room
        //socket.broadcast.to.emit -- it allows to send message to everyone except itself

    });



    socket.on('sendMessage',(message,cb)=>{
        const filter = new Filter();

        if(filter.isProfane(message))
        {
            return cb('profainity is not allowed');
        }
        const user =getUser(socket.id);
        if(!user)
        return socket.emit('redirect',"please reconnect");
       //validation required
        io.to(user.room).emit('message',message_text(message,user.username));
        //console.log(message);
        cb();
        
       
    });

    socket.on('shareposition',(pos,cb)=>{
        let posi= `https://www.google.com/maps?q=${pos.latitude},${pos.longitude}`;
        cb();
        socket.broadcast.emit('message',posi);
    });
    
    
    socket.on('disconnect',()=>{
        const user=removeUser(socket.id);
        
        if(user)
        {
           io.to(user.room).emit('message',message_text(`${user.username} has left!!`));
           io.to(user.room).emit('roomData',{
            room:user.room,
            users:getusersInRoom(user.room)
        })
        }
       

        
    })
});

//server (emit)-> client (recieve)- countUpdated
//client (emit) -> server (recieve(on)) - increment



server.listen(port,(err)=>{
    if(!err){
        console.log("server connection established at port 3000")
    }
});