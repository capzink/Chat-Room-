const express = require('express')
const http = require('http')
const path = require('path')
const socketio = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = socketio(server)
const formatMessage = require('./utils/messages')
const {
  userJoin,
  getCurrentUser,
  getRoomUsers,
  userLeave,
} = require("./utils/users");

//statis folder
app.use(express.static(path.join(__dirname, 'public')))
const BotName = 'ChatBot'
//run with client connect
io.on('connection', socket =>{

    socket.on("joinroom", ({username, room})=>{

      const user = userJoin(socket.id, username, room);
      socket.join(user.room);

      //Welcome current user
      socket.emit("message", formatMessage(BotName, "Welcome to the chat"));

      //Broadcast when user connects
      socket.broadcast
        .to(user.room)
        .emit(
          "message",
          formatMessage(BotName, `${user.username} has join the chat`)
        );
    });
    
    //listen for chatmessage
    socket.on("chatmessage", msg => {
      const user = getCurrentUser(socket.id);
      io.to(user.room).emit("message", formatMessage(user.username, msg));
    });
    
    //runs when client disconnects
    socket.on('disconnect', ()=>{
        const user  = userLeave(socket.id)
        if(user){
            io.to(user.room).emit('message',formatMessage(BotName, `${user.username} has left the chat`))

        }
    })
})
const port = process.env.port || 3000
server.listen(port, console.log('listening to port', port))
