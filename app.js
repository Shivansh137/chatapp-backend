const express = require('express')
const app = express();
const http = require('http');
const server = http.createServer(app)
const cors = require('cors');
const socketIo = require('socket.io');
app.use(cors());

const io = socketIo(server);
const users = [];

io.on('connection', (socket) => {
  socket.on('joined', ({ current_user }) => {
    users[socket.id] = current_user;
    socket.broadcast.emit('newUserJoined', ({ type: 'info', message: `${users[socket.id]} has joined the chat` }));
  })

  socket.on('sendMessage', ({ current_user, message }) => {
    let user = current_user;
    io.emit('newMessage', ({ user, message }));
  })

  socket.on('disconnect', () => {
    socket.broadcast.emit('userLeft', ({type:'info', message:`${users[socket.id]} has left the chat`}));
  })


 })

server.listen(process.env.PORT, ()=> {
    console.log('listening to the port ');
})