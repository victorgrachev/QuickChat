const http = require('http');
const SocketIO = require('socket.io');

const server = http.createServer();

const webSocketServer = SocketIO(server, {
  cors: {
    origin: 'http://localhost:9000',
    credentials: true,
  },
});

let tUsers = [];

webSocketServer.on('connection', (socket) => {
  let nUser = {};

  socket.on('sign_in', (nickname, callback) => {
    nUser = {
      id: new Date().getTime().toString(36),
      nickname: nickname ? nickname : 'Guest',
    };

    tUsers.push(nUser);

    socket.broadcast.emit('add_user', nUser);
    socket.broadcast.emit('sign_msg', nUser.nickname);
    setTimeout(() => callback({ user: tUsers }), 1000);
  });

  socket.on('send_message', (p_msg, p_nickname) => {
    socket.broadcast.emit('send_message_client', p_msg, p_nickname);
  });

  socket.on('disconnect', () => {
    tUsers = tUsers.filter((user) => user.id != nUser.id);
    socket.broadcast.emit('delete_user', nUser.id);
  });
});

server.listen('8080', '127.0.0.1', () => console.log(`Server start!`));
