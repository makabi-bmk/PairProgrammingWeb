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
    // const param = {};
    io.to(socket.id).emit('join', {});
  });

  socket.on('close', msg=> {
    const studentID = msg['studentID'];
    delete socketDict[studentID];
    console.log("delete");
    console.log(socketDict);
  });

  socket.on('check_pair', msg=> {
    console.log("pair");
    console.log(msg);
    const pairID = msg['pairID'];
    var param = {};
    if (pairID in socketDict) {
      param['ready'] = true;
      param['role'] = 'exploration';
    } else {
      param['ready'] = false;
      param['role'] = 'information';
    }
    io.to(socket.id).emit('check_pair', param);
  });

  // send-msgイベントを受け取ったらブロードキャストする
  socket.on('send-msg', msg => {
    socket.emit('new-msg', msg)
    socket.broadcast.emit('new-msg', msg)
    console.log(`receive message: ${JSON.stringify(msg)}`)
  });

});


server.listen(3001)