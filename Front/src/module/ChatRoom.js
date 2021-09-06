import _ from 'lodash';
import '../styles/ChatRoom.css';

function ChatRoom({ users, eventSendMessage }) {
  const shablonUser = `<% users.forEach(user => {
                          if (user.online) {%>
                          <li><span><%-user.name%></span></li>
                        <%} }); %>`;

  const shablonMsg = `<p><span><%-nickname%>: </span><%-msg%></p>`;

  const shablonChatRoom = `<div class="room">
                              <h1>Now in the room</h1>
                              <ul>
                                ${users ? shablonUser : ''}
                              </ul>
                            </div>
                            <div class="chat">
                              <div class="chat-window"></div>
                              <div class="message-window">
                                <div id="msg_in"  contentEditable="true" data-text="Enter your message"></div>
                                <button id="send_msg"></button>
                              </div>
                            </div>
                          </div>`;

  function render() {
    const chatRoom = _.template(shablonChatRoom)({
      users,
    });

    const root = document.createElement('div');
    root.classList.add('chat-room');
    root.innerHTML = chatRoom;

    if (eventSendMessage) {
      const btnSend = root.querySelector('#send_msg');
      btnSend.addEventListener('click', (event) => eventSendMessage(event));

      const msgWindow = root.querySelector('#msg_in');
      msgWindow.addEventListener('keyup', (event) => {
        if (event.code === 'Enter') {
          event.preventDefault();
          btnSend.click();
        }
      });
    }

    return root;
  }

  function createMsg(msg, nickname) {
    const newMsg = _.template(shablonMsg)({
      nickname: nickname ? nickname : 'Admin',
      msg,
    });

    let root = document.createElement('div');
    root.innerHTML = newMsg;
    root = root.firstElementChild;

    return root;
  }

  function renderUsers(users) {
    const chatUsers = _.template(shablonUser)({
      users,
    });

    let root = document.createElement('ul');
    root.innerHTML = chatUsers;

    return root;
  }

  this.render = render;
  ChatRoom.createMsg = createMsg;
  ChatRoom.renderUsers = renderUsers;
}

export default ChatRoom;
