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
}=require('./utils/users')

//statis folder
app.use(express.static(path.join(__dirname, 'public')))
const BotName = 'ChatBot'
//run with client connect
io.on('connection', socket =>{

    socket.on("joinroom", ({username, room})=>{
        const user = userJoin(username, room, socket.id);
        socket.join(user.room)


      //Welcome current user
      socket.emit("message", formatMessage(BotName, "Welcome to the chat"));

      //Broadcast when user connects
      socket.broadcast.to(user.room).emit(
        "message",
        formatMessage(BotName, "A user has joined the chat")
      );
    });
    //listen for chatmessage
    socket.on("chatmessage", (msg) => {
      io.emit('message',formatMessage('USER', msg))
    });

    //runs when client disconnects
    socket.on('disconnect', ()=>{
        io.emit('message',formatMessage(BotName, 'A user has left the chat'))
    })
})
const port = process.env.port || 3000
server.listen(port, console.log('listening to port', port))
