import '../styles/style.css';
import Authorization from '@module/Authorization.js';
import Loader from '@module/Loader.js';
import ChatRoom from '@module/ChatRoom.js';
import SocketIO from 'socket.io-client';

const domContainer = document.querySelector('.container');
let bAuthorization = false;
let sNickNameUser;
let oAuthorization, oLoader, oChatRoom;

let socket = SocketIO.connect(`http://127.0.0.1:8080/`);

const createMsg = (p_msg, p_user) => {
  const oListMsg = document.querySelector('.chat-window');
  const oMsg = document.createElement('p');
  const oUserMsg = document.createElement('span');

  oUserMsg.innerHTML = `${p_user ? p_user : 'Admin'}: `;

  oMsg.append(oUserMsg);
  oMsg.append(document.createTextNode(p_msg));
  oListMsg.append(oMsg);
};

const authSubmit = (event) => {
  event.preventDefault();
  bAuthorization = true;
  sNickNameUser = event.target[0].value;

  domContainer.innerHTML = null;
  oLoader = new Loader();
  domContainer.appendChild(oLoader.render());

  socket.emit('sign_in', sNickNameUser, ({ user }) => {
    const onSubmit = (event) => {
      event.preventDefault();
      const sMsg = event.target[0].value;
      event.target[0].value = '';
      createMsg(sMsg, sNickNameUser);
      socket.emit('send_message', sMsg, sNickNameUser);
    };
    oChatRoom = new ChatRoom({ user, onSubmit });
    domContainer.innerHTML = null;
    domContainer.appendChild(oChatRoom.render());
    createMsg(`Welcome to QuickChat, ${sNickNameUser}!`);
  });
};

const onEventAddUser = ({ id, nickname }) => {
  if (!bAuthorization) {
    return;
  }

  const oListUser = document.querySelector('.room ul');

  const oUser = document.createElement('li');
  const atrID = document.createAttribute('id');
  atrID.value = id;
  oUser.setAttributeNode(atrID);

  const oSpan = document.createElement('span');
  oSpan.innerHTML = nickname;
  oUser.append(oSpan);

  oListUser.append(oUser);
};

const onEventDeleteUser = (id) => {
  if (!bAuthorization) {
    return;
  }

  const oUser = document.querySelector(`.room li#${id}`);
  const sNickName = oUser.firstChild.innerHTML;
  oUser.remove();
  createMsg(`${sNickName} disconnected`);
};

const onEventSignMsg = (nickname) => {
  if (!bAuthorization) {
    return;
  }
  createMsg(`${nickname} join QuickChat`);
};

const onEventSendMessageClient = (p_msg, p_nickname) => {
  if (!bAuthorization) {
    return;
  }

  createMsg(p_msg, p_nickname);

  const player = new Audio('inMessage.mp3');
  player.volume = 0.4;
  player.play();
};

oAuthorization = new Authorization({ onSubmit: authSubmit });
domContainer.appendChild(oAuthorization.render());

socket.on('add_user', onEventAddUser);
socket.on('delete_user', onEventDeleteUser);
socket.on('sign_msg', onEventSignMsg);
socket.on('send_message_client', onEventSendMessageClient);
