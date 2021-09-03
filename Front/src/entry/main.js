import '../styles/style.css';
import Authorization from '@module/Authorization.js';
import Loader from '@module/Loader.js';
import ChatRoom from '@module/ChatRoom.js';
import registerEventSocket from './registerEventSocket';
import SocketIO from 'socket.io-client';
import cookieParser from 'cookie';

function renderLoader() {
  const load = new Loader();
  container.clean();
  container.append(load.render());
}

function renderAuthorization() {
  const page = new Authorization((event) => {
    event.preventDefault();

    nickname = event.target.firstElementChild.firstElementChild.value;
    const rememberUser = document.querySelector('#remember_me').checked;

    socket.emit('registration', nickname, rememberUser, (id) => {
      renderLoader();

      if (rememberUser) {
        document.cookie = 'user_info = ' + JSON.stringify({ id, nickname });
      }

      socket.emit('get_users', (users) => {
        renderChatRoom(users);
        socket.emit('send_msg', `${nickname} welcome QuickChat!`, 'Admin');
      });
    });
  });

  container.clean();
  container.append(page.render());
}

function renderChatRoom(users) {
  const paramPage = {
    users,
    eventSendMessage: () => {
      const msg = document.querySelector('#msg_in');
      socket.emit('send_msg', msg.innerText, nickname);
      msg.innerText = '';
    },
  };
  const page = new ChatRoom(paramPage);

  container.clean();
  container.append(page.render());
}

const container = {
  root: document.querySelector('.container'),
  clean: function () {
    this.root.childNodes.forEach((child) => child.remove());
  },
  append: function (content) {
    this.root.append(content);
  },
};

const socket = SocketIO.connect('http://localhost:8080', {
  withCredentials: true,
  extraHeaders: {
    user_info: 'user_info',
  },
});
registerEventSocket(socket);

let nickname;

if (document.cookie) {
  const cookie = cookieParser.parse(document.cookie);

  if (cookie.user_info) {
    nickname = JSON.parse(cookie.user_info).nickname;
  }
}

if (nickname) {
  renderLoader();
  socket.emit('get_users', (users) => {
    renderChatRoom(users);
    socket.emit('send_msg', `${nickname} welcome QuickChat!`, 'Admin');
  });
} else {
  renderAuthorization();
}
