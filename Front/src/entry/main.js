import '../styles/style.css';
import Authorization from '@module/Authorization.js';
import Loader from '@module/Loader.js';
import ChatRoom from '@module/ChatRoom.js';
import SocketIO from 'socket.io-client';

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
let oAuthorization;
let sNickNameUser;

let socket = SocketIO.connect(`http://127.0.0.1:8080/`);

const authorizationSubmit = (event) => {
  event.preventDefault();
  bAuthorization = true;
  sNickNameUser = event.target.firstElementChild.firstElementChild.value;

  domContainer.cleanContainer();
  domContainer.addContainer(new Loader().render());

  socket.emit('sign_in', sNickNameUser, ({ user }) => {
    const onSubmit = (event) => {
      event.preventDefault();
      const sMsg = event.target[0].value;
      event.target[0].value = '';
      createMsg(sMsg, sNickNameUser);
      socket.emit('send_message', sMsg, sNickNameUser);
    };
    const oChatRoom = new ChatRoom({ user, onSubmit });
    domContainer.cleanContainer();
    domContainer.addContainer(oChatRoom.render());
    const oNewMsg = ChatRoom.createMsg(
      `Welcome to QuickChat, ${sNickNameUser}!`
    );
    document.querySelector('.chat-window').append(oNewMsg);
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
  const oNewMsg = ChatRoom.createMsg(`${sNickName} disconnected`);
  document.querySelector('.chat-window').append(oNewMsg);
};

const onEventSignMsg = (nickname) => {
  if (!bAuthorization) {
    return;
  }
  const oNewMsg = ChatRoom.createMsg(`${nickname} join QuickChat`);
  document.querySelector('.chat-window').append(oNewMsg);
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

oAuthorization = new Authorization({ onSubmit: authorizationSubmit });
domContainer.addContainer(oAuthorization.render());

socket.on('add_user', onEventAddUser);
socket.on('delete_user', onEventDeleteUser);
socket.on('sign_msg', onEventSignMsg);
socket.on('send_message_client', onEventSendMessageClient);
