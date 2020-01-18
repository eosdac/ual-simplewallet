/*
Starts a server which accepts a callback from the wallet.  Relays the message back to the desktop browser using
a websocket interface
 */

import * as WebSocket from 'websocket';
import * as http from 'http';

const host = '0.0.0.0';
const port = 8877

const server = http.createServer(function(request, response) {
    // console.log(request);

    const { method, url } = request;
    const body = [];
    request.on('data', (chunk) => {
        body.push(chunk);
    }).on('end', () => {
        const bodyStr = Buffer.concat(body).toString();
        console.log(`${method} ${url} ${bodyStr}`)

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

// WebSocket server
wsServer.on('request', (_request) => {
    // console.log(`Got request`, req.message.utf8Data, data);
    // const connection = request.accept();
    // connections.push(connection);
    //
    // console.log((new Date()) + ' Connection accepted.');
    // connection.on('message', receiveWSMessage(connection));
});
