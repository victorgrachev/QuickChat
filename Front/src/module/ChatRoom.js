import _ from 'lodash';
import '../styles/ChatRoom.css';

function ChatRoom({ user, onSubmit }) {
  const sShablonUser = `<% user.forEach(user => {%>
                          <li id=<%-user.id%>><span><%-user.nickname%></span></li>
                        <% }); %>`;

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

    const oForm = oRootElement.querySelector('.message-window form');
    oForm.addEventListener('submit', (event) => {
      if (onSubmit) {
        onSubmit(event);
      }
    });
    return oRootElement;
  }

  this.render = render;
}

export default ChatRoom;
