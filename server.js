const express = require('express')
const http = require('http')
const path = require('path')
const socketio = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = socketio(server)
//statis folder
app.use(express.static(path.join(__dirname, 'public')))

//run with client connect
io.on('connection', socket =>{
    socket.emit('message', 'Welcome to the chat')

    //Broadcast when user connects
    socket.broadcast.emit('message', 'A user has joined the chat')

    //runs when client disconnects
    socket.on('disconnect', ()=>{
        io.emit('message', 'A user has left the chat')
    })
    
})

const port = process.env.port || 3000
server.listen(port, console.log('listening to port', port))
