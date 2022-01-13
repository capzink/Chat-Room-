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
    console.log('New websocket connection');
})

const port = process.env.port || 3000
const start = ()=>{
    app.listen(port, ()=>{
        console.log('listening on port', port);
    })
}

start()