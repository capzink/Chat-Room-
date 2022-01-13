const express = require('express')
const path = require('path')
const app = express()
const port = process.env.port || 3000

//statis folder

app.use(express.static(path.join(__dirname, 'public')))

const start = ()=>{
    app.listen(port, ()=>{
        console.log('listening on port', port);
    })
}

start()