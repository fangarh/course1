/* eslint-disable no-console */
/* eslint-disable guard-for-in */

var WebSocketServer = new require('ws');

// подключённые клиенты
var clients = {};
var clientProp = new Map();

// WebSocket-сервер на порту 8081
var webSocketServer = new WebSocketServer.Server ({ port: 9090 } );

webSocketServer.on('connection', function(ws) {
    var id = Math.random();    
    
    clients[id] = ws;

    console.log("новое соединение " + id);

    ws.on('message', function(message) {
        var msg = JSON.parse(message);
        
        if ( msg.type == 'command' ) {
            ParseCommand(id, msg)
        } else {
            for ( var key in clients ) {
                clients[key].send(message);
            }
        }
    });

    ws.on('close', function() {
        console.log('соединение закрыто ' + id);
        clientProp.delete(id);
        delete clients[id];

        for ( var key in clients ) {            
            clients[key].send(JSON.stringify({
                type: 'command',
                textData: 'updateUser',
                systemData: CollectUsers()
            }));
        }
    });
});

function ParseCommand (id, message) {
    console.log(id, message.textData); 
    if (message.textData == 'UserLoggedOn') {
        clientProp.set(id, message.user);

        for ( var key in clients ) {
            console.log(key);
            clients[key].send(JSON.stringify({
                type: 'command',
                textData: 'updateUser',
                systemData: CollectUsers()
            }));
        }
    }

    if (message.textData == 'UserImageUpdated') {
        clientProp.set(id, message.user);
        
        for ( var key in clients ) {            
            clients[key].send(JSON.stringify({
                type: 'command',
                textData: 'updateUser',
                systemData: CollectUsers()
            }));
        }
    }

    if (message.textData == 'UserImageReloaded') {
        clientProp.set(id, message.user);
        
        for ( var key in clients ) {            
            clients[key].send(JSON.stringify({
                type: 'command',
                textData: 'updateUserImage',
                user: clientProp.get(id)
            }));
        }
    }
}

function CollectUsers() {
    let result = [];

    for (let [, user] of clientProp)
        result.push(user);

    return Array.from(result);
}