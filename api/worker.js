const {parentPort} = require('node:worker_threads');

var socketDict = {};
var pairDict = {};

// console.log(parentPort);

const REQUEST = {
    join : 'join',
    close: 'close',
    check_pair: 'check_pair',
    update_question: 'update_question',
    exchange_role: 'exchange_role',
    disconnect: 'disconnect'
};

parentPort.on('message', async msg => {
    console.log("worker.js");
    console.log('worker received' + msg);

    const {action, args} = msg;

    if (action === REQUEST.join) {
        const studentID = args['studentID'];
        socketDict[studentID] = args['socketID'];
        console.log('worker:join');
        console.log(socketDict);
        parentPort.postMessage({
            action : REQUEST.join,
            args : {
                studentID : studentID
            }
        });
    }
    
    else if (action === REQUEST.close) {
        const studentID = args['studentID'];
        delete socketDict[studentID];
        console.log("delete");
        console.log(socketDict);
    }

    else if (action === REQUEST.check_pair) {
        const studentID = args['studentID'];
        const pairID = args['pairID'];
        pairDict[studentID] = pairID;
        var param = {};
        if (pairID in socketDict) {
            parentPort.postMessage({
                action : REQUEST.check_pair,
                args : {
                    mySocketID : socketDict[studentID],
                    pairSocketID: socketDict[pairID]
                }
            });
        }
    }

    else if (action === REQUEST.update_question) {
        const studentID = args['studentID'];
        const pairID = args['pairID'];
        const level = args['level'];

        parentPort.postMessage({
            action : REQUEST.update_question,
            args : {
                mySocketID : socketDict[studentID],
                pairSocketID: socketDict[pairID],
                num: [level, (Math.floor(Math.random() * 13) + 1)]
            }
        });
    }

    else if (action === REQUEST.exchange_role) {
        const studentID = args['studentID'];
        const pairID = args['pairID'];

        parentPort.postMessage({
            action : REQUEST.exchange_role,
            args : {
                mySocketID : socketDict[studentID],
                pairSocketID: socketDict[pairID]
            }
        });
        // var param = {};

        // param['role'] = '案内係';
        // io.to(socketDict[pairID]).emit('check_pair', param);
        // param['role'] = '探検係';
        // io.to(socket.id).emit('check_pair', param);
    }

    else if (action === REQUEST.disconnect) {
        const socketID = args['socketID'];

        var result = Object.keys(socketDict).reduce(function(r, k) {return socketDict[k] == socketID ? k : r}, null);
        if (result != null) {
            parentPort.postMessage({
                action : REQUEST.disconnect,
                args : {
                    mySocketID : socketDict[studentID],
                    pairSocketID: socketDict[pairID]
                }
            });
            delete socketDict[result];
            delete pairDict[result];
            console.log(result + ' was disconnected');
        }
    }
    
    else {
        throw new Error('Unknown action');
    }
    process.exit();
    
});

parentPort.on('error', async msg => {
    console.log('error' + msg);
});

// console.log('[Main] 初回メッセージを送る');
// parentPort.postMessage('Hello From Main');

// export {REQUEST};