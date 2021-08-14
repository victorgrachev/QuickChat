import _ from 'lodash';
import '../styles/ChatRoom.css';

function ChatRoom({ user, onSubmit }) {
  const sShablonUser = `<% user.forEach(user => {%>
                          <li id="<%-user.id%>"<span><%-user.nickname%></span></li>
                        <% }); %>`;

  const sShablonMsg = `<p><span><%-nickname%>: </span><%-msg%></p>`;

  const sShablonChatRoom = `<div class="room">
                              <h1>Now in the room</h1>
                              <ul>
                                ${user ? sShablonUser : ''}
                              </ul>
                            </div>
                            <div class="chat">
                              <div class="chat-window"></div>
                              <div class="message-window">
                                <form action="">
                                  <textarea name="message_in" cols="70" rows="4"></textarea>
                                  <button>Send</button>
                                </form>
                            </div>
                            </div>
                          </div>`;

  function render() {
    const oRenderShablon = _.template(sShablonChatRoom)({
      user,
    });

    const oRootElement = document.createElement('div');
    oRootElement.classList.add('chat-room');
    oRootElement.innerHTML = oRenderShablon;

    if (onSubmit) {
      const oForm = oRootElement.querySelector('.message-window form');
      oForm.addEventListener('submit', (event) => onSubmit(event));
    }

    return oRootElement;
  }

  function createMsg(p_msg, p_nickname) {
    const oNewMsg = _.template(sShablonMsg)({
      nickname: p_nickname ? p_nickname : 'Admin',
      msg: p_msg,
    });

    let oElem = document.createElement('div');
    oElem.innerHTML = oNewMsg;
    oElem = oElem.firstElementChild;

    return oElem;
  }

  function createUser(p_user) {
    let tUser = [p_user];

    const oNewUser = _.template(sShablonUser)({
      user: tUser,
    });

    let oElem = document.createElement('div');
    oElem.innerHTML = oNewUser;
    oElem = oElem.firstElementChild;

    return oElem;
  }

  this.render = render;
  ChatRoom.createMsg = createMsg;
  ChatRoom.createUser = createUser;
}

export default ChatRoom;
