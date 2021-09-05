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

    const nickname = document.querySelector('#nickname').value;
    const remember = document.querySelector('#remember_me').checked;

    socket.emit('registration', nickname, remember, (userID) => {
      renderLoader();

      if (remember) {
        localStorage.setItem('userID', userID);
      }

      socket.emit('get_users', (users) => {
        renderChatRoom(users, nickname);
        socket.emit('send_msg', `${nickname} welcome QuickChat!`, 'Admin');
      });
    });
  });

  container.clean();
  container.append(page.render());
}

function renderChatRoom(users, nickname) {
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

const socket = SocketIO.connect('http://localhost:8080');
registerEventSocket(socket);

renderAuthorization();

const userID = localStorage.getItem('userID');

if (userID) {
  socket.emit('get_name', userID, (name) => {
    document.querySelector('#nickname').value = name;
    document.querySelector('#registration').click();
  });
}
