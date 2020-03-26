const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const messageFormat = require('./utils/messages');
const {userJoin , getCurrentUser , getLeaveUser , getRoomUser} = require('./utils/users');

const PORT = process.env.PORT ||3000  ;
server.listen(PORT,() => console.log(`SERVER running on ${PORT}`));

const  app = express();
const server= http.createServer(app);
const io = socketio(server);
const admin = 'CRISIS';
app.use(express.static(path.join(__dirname,'public')));

// run when user connect

io.on('connection',socket => {
    socket.on('joinRoom',({username , room})=>{

        const user = userJoin(socket.id,username,room);

        socket.join(user.room);

        socket.emit('message',messageFormat(admin, 'welcome in the chatroom'));

        //Send to all user that someone is join the room
        io.to(user.room).emit('message',messageFormat(admin,`${user.username} join the chat`));

        io.to(user.room).emit('roomUsers',{
            room : user.room,
            users : getRoomUser(user.room)
        })
    });

    // if user leave the room


    //capture msg & send it to all users
    socket.on('chatMessage',(msg)=>{
        const user = getCurrentUser(socket.id);

        io.to(user.room).emit('message',messageFormat(user.username,msg));
    });

    socket.on('disconnect',()=> {
        const user = getLeaveUser(socket.id);
        if (user) {

        io.to(user.room).emit('message', messageFormat(admin, ` ${user.username} has left the chatroom`));
            io.to(user.room).emit('roomUsers',{
                room : user.room,
                users : getRoomUser(user.room)
            })}
    });
});


