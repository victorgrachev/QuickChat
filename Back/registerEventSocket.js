const UserDb = require('./UserDb.js');

function registerEventSocket(io) {
  const userDb = new UserDb();

  io.on('connection', (socket) => {
    socket.on('registration', (name, remember, fn) => {
      const newUser = userDb.createUser(name, true, remember, (id) => {
        const user = userDb.getUser(id);

        if (user.remember) {
          userDb.setOnline(user.id, true);
          socket.userID = user.id;
          fn(socket.userID);
        } else {
          socket.emit('error_registration', 'User is already registered');
        }
      });

      if (newUser) {
        socket.userID = newUser.id;
        fn(socket.userID);
      }

      socket.broadcast.emit('update_users', userDb.getUsers());
    });

    socket.on('get_name', (id, fn) => {
      const user = userDb.getUser(id);
      if (user) {
        fn(user.name);
      }
    });

    socket.on('get_users', (func) => {
      func(userDb.getUsers());
    });

    socket.on('send_msg', (msg, nickname) => {
      socket.emit('get_msg', msg, nickname);
      socket.broadcast.emit('get_msg', msg, nickname);
    });

    socket.on('disconnect', () => {
      if (!socket.userID) return;

      const user = userDb.getUser(socket.userID);

      if (user) {
        if (user.remember) {
          userDb.setOnline(socket.userID, false);
        } else {
          userDb.deleteUser(socket.userID);
        }

        socket.broadcast.emit('update_users', userDb.getUsers());
        socket.broadcast.emit('get_msg', `${user.name} disconnect`, 'Admin');
      }
    });
  });
}

module.exports = registerEventSocket;
