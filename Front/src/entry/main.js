import '../styles/style.css';
import Authorization from '@module/Authorization.js';
import Loader from '@module/Loader.js';
import ChatRoom from '@module/ChatRoom.js';
import registerEventSocket from './registerEventSocket';
import SocketIO from 'socket.io-client';

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

    renderLoader();

    socket.emit('registration', nickname, (value) => {
      if (rememberUser) localStorage.setItem('token', value);
    });

    socket.emit('get_users', (users) => {
      renderChatRoom(users);
      socket.emit('send_msg', `${nickname} welcome QuickChat!`, 'Admin');
    });
  });

  container.clean();
  container.append(page.render());
}

function renderChatRoom(users) {
  const paramPage = {
    users,
    eventSendMessage: (event) => {
      event.preventDefault();
      const msg = event.target.firstElementChild.value;
      event.target.firstElementChild.value = '';
      socket.emit('send_msg', msg, nickname);
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

const socket = SocketIO.connect('http://localhost:8080');
const token = localStorage.getItem('token');
let nickname;

if (token) {
  renderLoader();
  socket.emit('get_users', (users) => {
    renderChatRoom(users);
  });
} else {
  renderAuthorization();
}

registerEventSocket(socket);
