const express = require('express')();
const http = require('http');
const { Server } = require("socket.io");
const cluster = require("cluster");
const numCPUs = require("os").cpus().length;
const { setupMaster, setupWorker } = require("@socket.io/sticky");
const { createAdapter, setupPrimary } = require("@socket.io/cluster-adapter");

var socketDict = {};
var pairDict = {};

// const cors = require('cors')

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);
  const httpServer = http.createServer(express);

  setupMaster(httpServer, {
    loadBalancingMethod: "least-connection",
  });

  setupPrimary();

  cluster.setupMaster({
    serialization: "advanced",
  });

  httpServer.listen(3001);

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker) => {
    console.log(`Worker ${worker.process.pid} died`);
    cluster.fork();
  });
} else {
  console.log(`Worker ${process.pid} started`);
  const httpServer = http.createServer(express);

  const io = new Server(httpServer, {
    cors: {
        origin: "http://ict-edu.okinawa-ct.ac.jp:3000",
        // origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        // allowHeaders: [""]
        // credentials: rue
    }
  });

  io.adapter(createAdapter());
  setupWorker(io);

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
}
