const http = require('http');
const SocketIO = require('socket.io');
const registerEventSocket = require('./registerEventSocket.js');

const server = http.createServer();

const connect = SocketIO(server, {
  cors: {
    origin: '*',
  },
});

registerEventSocket(connect);

const PORT = process.env.PORT || 8080;
server.listen(PORT);
