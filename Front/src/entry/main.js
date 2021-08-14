import '../styles/style.css';
import Authorization from '@module/Authorization.js';
import Loader from '@module/Loader.js';
import ChatRoom from '@module/ChatRoom.js';
import SocketIO from 'socket.io-client';

const socket = SocketIO.connect('http://localhost:8080');

const domContainer = {
  elem: document.querySelector('.container'),
  cleanContainer: function () {
    this.elem.childNodes.forEach((child) => child.remove());
  },
  addContainer: function (p_elem) {
    this.elem.append(p_elem);
  },
};

let bAuthorization = false;
let sNickNameUser;

const authorizationSubmit = (event) => {
  event.preventDefault();
  bAuthorization = true;
  sNickNameUser = event.target.firstElementChild.firstElementChild.value;

  if (!sNickNameUser) sNickNameUser = 'Guest';

  domContainer.cleanContainer();
  domContainer.addContainer(new Loader().render());

  socket.emit('sign_in', sNickNameUser, (p_user) => {
    const onSubmit = (event) => {
      event.preventDefault();

      const sMsg = event.target.firstElementChild.value;
      event.target.firstElementChild.value = '';

      const oNewMsg = ChatRoom.createMsg(sMsg, sNickNameUser);
      document.querySelector('.chat-window').append(oNewMsg);

      socket.emit('send_msg', sMsg, sNickNameUser);
    };

    domContainer.cleanContainer();
    domContainer.addContainer(
      new ChatRoom({ user: p_user, onSubmit }).render()
    );

    const oNewMsg = ChatRoom.createMsg(
      `Welcome to QuickChat, ${sNickNameUser}!`
    );
    document.querySelector('.chat-window').append(oNewMsg);
  });
};

domContainer.addContainer(
  new Authorization({ onSubmit: authorizationSubmit }).render()
);

// User connect socket event
const onEventUserConnect = ({ id, nickname }) => {
  if (!bAuthorization) {
    return;
  }

  const oListUser = document.querySelector('.room ul');
  const oUser = ChatRoom.createUser({ id, nickname });
  oListUser.append(oUser);
};
socket.on('user_connect', onEventUserConnect);

// Message connect user socket event
const onEventMsgConnectUser = (p_nickname) => {
  if (!bAuthorization) {
    return;
  }

  const oNewMsg = ChatRoom.createMsg(`${p_nickname} join QuickChat`);
  document.querySelector('.chat-window').append(oNewMsg);
};
socket.on('msg_connect_user', onEventMsgConnectUser);

// User disconnection socket event
const onEventDisconnectUser = ({ id, nickname }) => {
  if (!bAuthorization) {
    return;
  }

  const oUserDisconnect = document.querySelector(`.room li#${id}`);
  oUserDisconnect.remove();

  const oNewMsg = ChatRoom.createMsg(`${nickname} disconnected`);
  document.querySelector('.chat-window').append(oNewMsg);
};
socket.on('disconnect_user', onEventDisconnectUser);

// Receive message socket event
const onEventReceiveMsg = (p_msg, p_nickname) => {
  if (!bAuthorization) {
    return;
  }

  const oNewMsg = ChatRoom.createMsg(p_msg, p_nickname);
  document.querySelector('.chat-window').append(oNewMsg);

  const player = new Audio('inMessage.mp3');
  player.volume = 0.4;
  player.play();
};
socket.on('receive_msg', onEventReceiveMsg);
