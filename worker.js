const {parentPort} = require('worker_threads');

var socketDict = {};
var pairDict = {};

const REQUEST = {
    join: 'join',
};

parentPort.on('message', async msg => {
    console.log('worker received: %o', msg);

    const {action, args} = msg;

    if (action === REQUEST.join) {
        const studentID = msg['studentID'];
        socketDict[studentID] = msg['socketID'];
        console.log(socketDict);
        parentPort.postMessage({
            action : 'join',
            args : {
                studentID : studentID
            }
        });
    }
    
    else {
        throw new Error('Unknown action');
    }
    process.exit();
    
});