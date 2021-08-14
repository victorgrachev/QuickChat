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
  let oUser = {};

  socket.on('sign_in', (nickname, callback) => {
    oUser = {
      id: new Date().getTime().toString(36),
      nickname: nickname ? nickname : 'Guest',
    };

    tUsers.push(oUser);

    socket.broadcast.emit('user_connect', oUser);
    socket.broadcast.emit('msg_connect_user', oUser.nickname);
    setTimeout(() => callback(tUsers), 1000);
  });

  socket.on('send_msg', (p_msg, p_nickname) => {
    socket.broadcast.emit('receive_msg', p_msg, p_nickname);
  });

  socket.on('disconnect', () => {
    tUsers = tUsers.filter((user) => user.id != oUser.id);
    socket.broadcast.emit('disconnect_user', oUser);
  });
});

server.listen('8080', '127.0.0.1', () => console.log(`Server start!`));
