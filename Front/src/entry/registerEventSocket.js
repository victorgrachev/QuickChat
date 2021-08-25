import ChatRoom from '@module/ChatRoom.js';

function registerEventSocket(socket) {
  socket.on('connect', () => {
    socket.sendBuffer = [];
  });

  socket.on('get_msg', (msg, nickname) => {
    const chat = document.querySelector('.chat-window');

    if (chat) {
      const newMsg = ChatRoom.createMsg(msg, nickname);
      const player = new Audio('inMessage.mp3');

      chat.append(newMsg);
      player.volume = 0.4;
      player.play();
    }
  });

  socket.on('update_users', (users) => {
    const room = document.querySelector('.room');

    if (room) {
      document.querySelector('.room ul').remove();
      room.append(ChatRoom.renderUsers(users));
    }
  });
}

export default registerEventSocket;
