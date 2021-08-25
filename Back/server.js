const http = require('http');
const SocketIO = require('socket.io');

const server = http.createServer();

const socket = SocketIO(server, {
  cors: {
    origin: '*',
  },
});

// TODO Перенос пользователей в БД
let users = [];

socket.on('connection', (socket) => {
  const token = new Date().getTime().toString(36);

  socket.on('registration', (nickname, func) => {
    const user = {
      id: new Date().getTime().toString(36),
      online: true,
      nickname,
      token,
    };
    users.push(user);

    func(token);
    socket.registered = true;
    socket.nickname = user.nickname;
    socket.broadcast.emit('update_users', users);
  });

  socket.on('get_users', (func) => {
    setTimeout(func.bind(null, users), 1000);
  });

  socket.on('send_msg', (msg, nickname) => {
    socket.emit('get_msg', msg, nickname);
    socket.broadcast.emit('get_msg', msg, nickname);
  });

  socket.on('disconnect', () => {
    if (!socket.registered) return;
    const indx = users.findIndex((user) => user.token === token);

    if (indx) {
      users[indx].online = false;
      socket.broadcast.emit('update_users', users);
      socket.broadcast.emit(
        'get_msg',
        `${socket.nickname} disconnect`,
        'Admin'
      );
    }
  });
});

server.listen('8080', 'localhost', () => console.log(`Server start!`));
