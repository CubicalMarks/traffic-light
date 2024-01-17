import { createServer } from 'net';
const aedes = require('aedes')();
const httpServer = require('http').createServer();
const webSocket = require('websocket-stream');

export const mqttBroker = (port: number) => {
    // const server = createServer(aedes.handle);
    // return server.listen(port, () => {
    //     console.log(`MQTT server started on port ${port}`);
    // });

    webSocket.createServer({ server: httpServer}, aedes.handle)
    return httpServer.listen(port, function() {
        console.log('MQTT/websocket server listening on port ', port);
    });
}

