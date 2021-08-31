const http = require('http');
const cookieParser = require('cookie');
const SocketIO = require('socket.io');

const server = http.createServer();

const connect = SocketIO(server, {
  cors: {
    origin: 'https://quickchat-4fe85.web.app/',
    allowedHeaders: ['user_info'],
    credentials: true,
  },
});

// TODO Перенос пользователей в БД
let users = [];

connect.on('connection', (socket) => {
  let userId;

  if (socket.handshake.headers.cookie) {
    const cookie = cookieParser.parse(socket.handshake.headers.cookie);

    if (cookie.user_info) {
      userId = JSON.parse(cookie.user_info).id;
      const indx = users.findIndex((user) => user.id === userId);

      if (indx != -1) {
        users[indx].online = true;
      }
    }
  } else {
    userId = new Date().getTime().toString(36);
  }

  socket.on('registration', (nickname, remember, func) => {
    const indx = users.findIndex((user) => user.nickname === nickname);

    if (indx === -1) {
      const user = {
        id: userId,
        online: true,
        nickname,
        remember,
      };
      users.push(user);

      func(userId);
      socket.registered = true;
      socket.nickname = user.nickname;
      socket.broadcast.emit('update_users', users);
    } else {
      socket.emit('error_registration', 'User is already registered');
    }
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
    const indx = users.findIndex((user) => user.id === userId);

    if (indx != -1) {
      if (users[indx].remember) {
        users[indx].online = false;
      } else {
        users.splice(indx, 1);
      }

      socket.broadcast.emit('update_users', users);
      socket.broadcast.emit(
        'get_msg',
        `${socket.nickname} disconnect`,
        'Admin'
      );
    }
  });
});

const PORT = process.env.PORT || 80;
server.listen(PORT);
