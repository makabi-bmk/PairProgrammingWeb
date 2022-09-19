const express = require('express')();
const server = require('http').createServer(express);

const nowTime = Date.now();
const logName = './log/' + nowTime + '.log';
const fs = require('fs');

var socketDict = {};
var pairDict = {};

// const cors = require('cors')
const io = require('socket.io')(server, {
    cors: {
        // origin: "http://ict-edu.okinawa-ct.ac.jp",
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        allowHeaders: [""]
        // credentials: rue
    }
});

try {
  fs.writeFileSync(logName, 'test', 'utf-8');
} catch(err) {
  console.log(err);
}

io.on('connection', socket => {
  console.log(`socket_id: ${socket.id} is connected.`)

  socket.on('join', msg=> {
    const studentID = msg['studentID'];
    socketDict[studentID] = socket.id;
    // const param = {};
    io.to(socket.id).emit('join', {});
  });

  socket.on('close', msg=> {
    const studentID = msg['studentID'];
    delete socketDict[studentID];
  });

  socket.on('check_pair', msg=> {
    console.log("pair");
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
  });

  socket.on('updateQuestion', msg=> {
    const pairID = msg['pairID'];
    var param = {};
    var num = [msg['level'], (Math.floor(Math.random() * 13) + 1)];
    param['num'] = num;

    wrieteLog();
    io.to(socket.id).emit('updateQuestion', param);
    io.to(socketDict[pairID]).emit('updateQuestion', param);
  });

  socket.on('exchangeRole', msg=> {
    const pairID = msg['pairID'];
    var param = {};

    param['role'] = '案内係';
    io.to(socketDict[pairID]).emit('check_pair', param);
    param['role'] = '探検係';
    io.to(socket.id).emit('check_pair', param);
  });

  socket.on('disconnect', () => {
      var id = socket.id;
      //TODO: ここ全探じゃなくて別で値逆のリスト用意して動かす
      var result = Object.keys(socketDict).reduce(function(r, k) {return socketDict[k] == id ? k : r}, null);
      if (result != null) {
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

function wrieteLog() {
  var log = 'aiueo';
  try {
    fs.appendFileSync(logName, log, 'utf-8');
  } catch(err) {
    console.log(err);
  }
}

server.listen(3001);