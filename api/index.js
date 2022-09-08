const express = require('express')();
const server = require('http').createServer(express);

var socketDict = {};

// const cors = require('cors')
const io = require('socket.io')(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
        // allowHeaders: [""],
        // credentials: rue
    }
})

io.on('connection', socket => {
  console.log(`socket_id: ${socket.id} is connected.`)

  socket.on('join', msg=> {
    const studentID = msg['studentID'];
    socketDict[studentID] = socket.id;
    console.log(socketDict);
  });

  // send-msgイベントを受け取ったらブロードキャストする
  socket.on('send-msg', msg => {
    socket.emit('new-msg', msg)
    socket.broadcast.emit('new-msg', msg)
    console.log(`receive message: ${JSON.stringify(msg)}`)
  })
})

server.listen(3001)