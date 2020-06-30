const express = require('express');
const app = express();
const http = require('http')
const socketio = require('socket.io')
const path = require('path');
const Filter = require('bad-words')

const port = process.env.PORT || 4001
const server = http.createServer(app);
const io = socketio(server);

const publicDirectory = path.join(__dirname, '../public')

app.use(express.static(publicDirectory))



io.on('connection', (socket) => {
    console.log('New connection established!');

    socket.emit('message', 'Welcome!')
    socket.broadcast.emit('message', 'A new user has joined!')

    socket.on('sendMessage', (message, callback) => {
        const filter = new Filter()

        if(filter.isProfane(message)){
           return callback('Profanity is not allowed!');
        }
        io.emit('message', message)
        callback()
    })

    socket.on('sendLocation', ({latitude, longitude}, callback) => {
        io.emit('message', `https://google.com/maps?q=${latitude},${longitude}`)

        callback()
    })

    socket.on('disconnect', () => {
        io.emit('message', 'A user has left!')
    })

})


server.listen(port, () => {
    console.log(`server started on port ${port}`);
})