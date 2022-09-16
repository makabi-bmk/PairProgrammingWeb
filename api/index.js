const express = require('express')();
const server = require('http').createServer(express);

var socketDict = {};
var pairDict = {};

// const cors = require('cors')
const io = require('socket.io')(server, {
    cors: {
        origin: "http://ict-edu.okinawa-ct.ac.jp:50001",
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
    const studentID = msg['studentID'];
    const pairID = msg['pairID'];
    pairDict[studentID] = pairID;
    var param = {};
    if (pairID in socketDict) {
      // param['ready'] = true;
      param['role'] = '案内係';
      io.to(socketDict[pairID]).emit('check_pair', param);
      param['role'] = '探検係';
      io.to(socket.id).emit('check_pair', param);
    }
    // } else {
    //   // param['ready'] = false;
    // }
    // io.to(socket.id).emit('check_pair', param);
  });

  socket.on('updateQuestion', msg=> {
    const pairID = msg['pairID'];
    var param = {};
    var num = [msg['level'], (Math.floor(Math.random() * 13) + 1)];
    param['num'] = num;

    io.to(socket.id).emit('updateQuestion', param);
    io.to(socketDict[pairID]).emit('updateQuestion', param);
  });

  socket.on('exchangeRole', msg=> {
    const pairID = msg['pairID'];
    console.log(pairID);
    var param = {};

    param['role'] = '案内係';
    io.to(socketDict[pairID]).emit('check_pair', param);
    param['role'] = '探検係';
    io.to(socket.id).emit('check_pair', param);
  });

  socket.on('disconnect', () => {
      var id = socket.id;
      var result = Object.keys(socketDict).reduce(function(r, k) {return socketDict[k] == id ? k : r}, null);
      if (result != null) {
        console.log('result = ' + result);
        console.log(pairDict[result]);
        console.log(socketDict[pairDict[result]]);
        io.to(socketDict[pairDict[result]]).emit('check_pair', {});
        delete socketDict[result];
        delete pairDict[result];
        console.log(result + ' was disconnected');
      }
  });


  // send-msgイベントを受け取ったらブロードキャストする
  // socket.on('send-msg', msg => {
  //   socket.emit('new-msg', msg);
  //   socket.broadcast.emit('new-msg', msg);
  //   console.log(`receive message: ${JSON.stringify(msg)}`);
  // });

});


server.listen(3001);