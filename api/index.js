const express = require('express')();
const server = require('http').createServer(express);

const nowTime = Date.now();
const logName = './log/' + nowTime + '.log';
const fs = require('fs');

var socketDict = {};
var pairDict = {};

// var levelDict = [];
var helpList = [];
var rejectHelpCount = 0;

// for (var i = 0; i < 4; i++) {
//   var list = [];
//   levelDict.push(list);
// }

// const cors = require('cors')
const io = require('socket.io')(server, {
    cors: {
        origin: "http://ict-edu.okinawa-ct.ac.jp",
        // origin: "http://localhost:3000",
        methods: ["GET", "POST"]
        // allowHeaders: [""]
        // credentials: true
    }
});

try {
  fs.writeFileSync(logName, '', 'utf-8');
} catch(err) {
  console.log(err);
}

async function myAsync(log) {
  await writeLog(log);
}

function writeLog(log) {
  return new Promise(function(resolve) {
    try {
      // console.log(log);
      fs.appendFileSync(logName, log + '\n', 'utf-8');
    } catch(err) {
      console.log(err);
      try {
        fs.writeFileSync(logName, '', 'utf-8');
      } catch(err) {
        console.log(err);
      }
    }
  })
}

function checkHelp(level) {
  if (helpList.length > 0) {
    console.log("level = " + level);
    console.log(helpList[0]);
    if (level >= helpList[0]['level']) {
      var helpStudent = {ID: helpList[0]['ID'], name:helpList[0]['name']};
      helpList.shift();
      rejectHelpCount = 0;
      return helpStudent;
    } else {
      rejectHelpCount++;
      if (rejectHelpCount > 3) {
        //TODO: ヘルプが来なかったときユーザ側に処理を返す
        helpList.shift();
        rejectHelpCount = 0;
      }
    }
  }
  return -1;
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
    console.log(pairDict);
    console.log(socketDict);
    // var param = {};
    if (pairID in socketDict) {
      // param['ready'] = true;
      // param['role'] = '案内係';

      io.to(socketDict[pairID]).emit('check_pair', {
        role: '案内係',
        exchange: false,
      });
      // param['role'] = '探検係';
      io.to(socket.id).emit('check_pair', {
        role: '探検係',
        exchange: false,
      });
    }
  });

  socket.on('updateQuestion', msg=> {
    const pairID = msg['pairID'];
    const level = msg['level'];

    var param = {};
    var num = [level, (Math.floor(Math.random() * 13) + 1)];
    param['num'] = num;
    param['help'] = false;

    var helpStudent = checkHelp(level);

    if (helpStudent != -1) {

      console.log('helpStudent = ' + helpStudent);

      var helpStudentName = helpStudent['name'];
      var helpStudentID = helpStudent['ID'];
      var helpPairID = pairDict[helpStudentID];

      param['help'] = true;
      param['help_name'] = helpStudentName;

      console.log("help Accept");
      console.log(helpStudentID);

      io.to(helpStudentID).emit('help_accept', {help_studentID: socket.id});
      io.to(helpPairID).emit('help_accept', {help_studentID: socket.id});
    }

    io.to(socket.id).emit('updateQuestion', param);
    io.to(socketDict[pairID]).emit('updateQuestion', param);

    myAsync(JSON.stringify(msg));
  });

  socket.on('exchangeRole', msg=> {
    const pairID = msg['pairID'];

    // param['role'] = '案内係';
    io.to(socketDict[pairID]).emit('check_pair', {
      exchange: true,
      role: '案内係',
    });
    // param['role'] = '探検係';
    io.to(socket.id).emit('check_pair', {
      exchange: true,
      role: '探検係',
    });
  });

  socket.on('requestHelp', msg=> {
    var help = {ID:socket.id, level:msg['level'], name:msg['name']};
    helpList.push(help);
    console.log("help");
    console.log(help);
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
});

server.listen(3001);