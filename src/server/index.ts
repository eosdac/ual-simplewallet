/*
Starts a server which accepts a callback from the wallet.  Relays the message back to the desktop browser using
a websocket interface
 */

import * as WebSocket from 'websocket';
import * as http from 'http';

const host = '0.0.0.0';
const port = 8877;

const connections = new Map();

class WSClientConnection {
    private connection: any;
    private uuid: any;
    constructor (connection, uuid) {
        this.connection = connection;
        this.uuid = uuid;
        console.log(this.uuid, this.connection);
    }

    setUUID (uuid) {
        this.uuid = uuid;
        connections.set(uuid, this);
    }

    send (data) {
        this.connection.sendUTF(data);
    }
}

const server = http.createServer(function(request, response) {
    // console.log(request);

    const { method, url } = request;
    const body = [];
    request.on('data', (chunk) => {
        body.push(chunk);
    }).on('end', () => {
        const bodyStr = Buffer.concat(body).toString();
        if (bodyStr && method === 'POST'){
            console.log(`${method} ${url} ${bodyStr}`);

            const bodyObj = JSON.parse(bodyStr);
            const uuid = bodyObj.actionId;

            const connection = connections.get(uuid);
            if (connection){
                console.log(`Have connection, relaying`);
                connection.send(bodyStr);
            }
        }

        response.writeHead(200, {
            "Content-Type": "text/plain"
        });
        response.end('ok');
    });

});
server.listen(port, host, () => {
    console.log(`Started http/websocket server on ${host}:${port}`);
});

// create the server
const wsServer = new WebSocket.server({
    httpServer: server
});

const receiveWSMessage = (connection) => {
    console.log(`Received WS message`);
    return (message) => {
        if (message.type === 'utf8') {
            const msgObj = JSON.parse(message.utf8Data);
            connection.setUUID(msgObj.uuid);
            console.log('Received Message: ', msgObj);
            connection.send(message.utf8Data);
        }
    }
};

// WebSocket server
wsServer.on('request', (request) => {
    const connection = request.accept();
    console.log((new Date()) + ' Connection accepted.');
    connection.on('message', receiveWSMessage(new WSClientConnection(connection, null)));
});
