const http = require('http');
const decoratorSocket = require('./decoratorSocket.js');

const server = http.createServer();
decoratorSocket(server);

const PORT = process.env.PORT || 8080;
server.listen(PORT);
