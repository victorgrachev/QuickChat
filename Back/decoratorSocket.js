const registerEventSocket = require('./registerEventSocket.js');
const SocketIO = require('socket.io');

function decoratorSocket(server) {
  const socket = SocketIO(server, {
    cors: {
      origin: '*',
    },
  });

  registerEventSocket(socket);

  return socket;
}

module.exports = decoratorSocket;
