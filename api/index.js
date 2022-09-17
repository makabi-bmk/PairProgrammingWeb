// import {REQUEST} from '../worker.js';

const express = require('express')();
const server = require('http').createServer(express);
const {Worker} = require('node:worker_threads');
const worker = new Worker('./api/worker.js');

// var socketDict = {};
// var pairDict = {};

// console.log(worker);

const REQUEST = {
  join : 'join',
  close: 'close',
  check_pair: 'check_pair',
  update_question: 'update_question',
  exchange_role: 'exchange_role',
  disconnect: 'disconnect'
};

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

worker.on('message', msg => {
  console.log("index.js");
  console.log('worker received: %o', msg);
  const {action, args} = msg;

  if (action === REQUEST.join) {
    console.log('joined');
    const studentID = args['studentID'];
    io.to(studentID).emit('join', {});
  }

  else if (action === REQUEST.check_pair) {
    const mySocketID    = args['mySocketID'];
    const pairSocketID  = args['pairSocketID'];

    io.to(pairSocketID).emit(REQUEST.check_pair, {role: '案内係'});
    io.to(mySocketID).emit(REQUEST.check_pair, {role: '探検係'});
  }

  else if (action === REQUEST.update_question) {
    const mySocketID    = args['mySocketID'];
    const pairSocketID  = args['pairSocketID'];
    const num           = args['num'];

    io.to(mySocketID).emit(REQUEST.update_question, {num: num});
    io.to(pairSocketID).emit(REQUEST.update_question, {num: num});
  }

  else if (action === REQUEST.exchange_role) {
    const mySocketID    = args['mySocketID'];
    const pairSocketID  = args['pairSocketID'];

    io.to(pairSocketID).emit(REQUEST.exchange_role, {role: '案内係'});
    io.to(mySocketID).emit(REQUEST.exchange_role, {role: '探検係'});
  }

  else if (action === REQUEST.disconnect) {
    const pairSocketID  = args['pairSocketID'];
    io.to(pairSocketID).emit(REQUEST.check_pair, {});
  }
});

io.on('connection', socket => {
  console.log(`socket_id: ${socket.id} is connected.`)

  socket.on(REQUEST.join, msg=> {
    worker.postMessage({
      action: REQUEST.join,
      args: {
        studentID : msg['studentID'],
        socketID  : socket.id
      }
    });
    // console.log(worker);
    console.log('join　送った');
    // const studentID = msg['studentID'];
    // socketDict[studentID] = socket.id;
    // console.log(socketDict);
    // const param = {};
    // io.to(socket.id).emit('join', {});
  });

  socket.on(REQUEST.close, msg=> {
    worker.postMessage({
      action: REQUEST.close,
      args: {
        studentID : msg['studentID']
      }
    });
    // const studentID = msg['studentID'];
    // delete socketDict[studentID];
    // console.log("delete");
    // console.log(socketDict);
  });

  socket.on(REQUEST.check_pair, msg=> {
    worker.postMessage({
      action: REQUEST.check_pair,
      args: {
        studentID : msg['studentID'],
        pairID : msg['pairID']
      }
    });
    // const studentID = msg['studentID'];
    // const pairID = msg['pairID'];
    // pairDict[studentID] = pairID;
    // var param = {};
    // if (pairID in socketDict) {
    //   // param['ready'] = true;
    //   param['role'] = '案内係';
    //   io.to(socketDict[pairID]).emit('check_pair', param);
    //   param['role'] = '探検係';
    //   io.to(socket.id).emit('check_pair', param);
    // }
    // } else {
    //   // param['ready'] = false;
    // }
    // io.to(socket.id).emit('check_pair', param);
  });

  socket.on(REQUEST.update_question, msg=> {
    worker.postMessage({
      action: REQUEST.update_question,
      args: {
        studentID : msg['studentID'],
        pairID : msg['pairID'],
        level: msg['level']
      }
    });
    // const pairID = msg['pairID'];
    // var param = {};
    // var num = [msg['level'], (Math.floor(Math.random() * 13) + 1)];
    // param['num'] = num;

    // io.to(socket.id).emit('updateQuestion', param);
    // io.to(socketDict[pairID]).emit('updateQuestion', param);
  });

  socket.on(REQUEST.exchange_role, msg=> {
    worker.postMessage({
      action: REQUEST.update_question,
      args: {
        studentID : msg['studentID'],
        pairID : msg['pairID'],
      }
    });

    // const pairID = msg['pairID'];
    // console.log(pairID);
    // var param = {};

    // param['role'] = '案内係';
    // io.to(socketDict[pairID]).emit('check_pair', param);
    // param['role'] = '探検係';
    // io.to(socket.id).emit('check_pair', param);
  });

  socket.on(REQUEST.disconnect, () => {
    worker.postMessage({
      action: REQUEST.disconnect,
      args: {
        socketID  : socket.id
      }
    });

      // var id = socket.id;
      // var result = Object.keys(socketDict).reduce(function(r, k) {return socketDict[k] == id ? k : r}, null);
      // if (result != null) {
      //   console.log('result = ' + result);
      //   console.log(pairDict[result]);
      //   console.log(socketDict[pairDict[result]]);
      //   io.to(socketDict[pairDict[result]]).emit('check_pair', {});
      //   delete socketDict[result];
      //   delete pairDict[result];
      //   console.log(result + ' was disconnected');
      // }
  });


  // send-msgイベントを受け取ったらブロードキャストする
  // socket.on('send-msg', msg => {
  //   socket.emit('new-msg', msg);
  //   socket.broadcast.emit('new-msg', msg);
  //   console.log(`receive message: ${JSON.stringify(msg)}`);
  // });

});


server.listen(3001);