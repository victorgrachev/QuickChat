import '../styles/style.css';
import 'animate.css';
import Authorization from '@module/Authorization.js';
import Loader from '@module/Loader.js';
import ChatRoom from '@module/ChatRoom.js';

const oContainer = document.querySelector('.container');
const oAuthorization = new Authorization({
  onSubmit: (event) => {
    const oLoader = new Loader();
    oContainer.innerHTML = null;
    oContainer.appendChild(oLoader.getElement());
    setTimeout(() => {
      oContainer.innerHTML = null;
    }, 2000);
  },
});
oContainer.appendChild(oAuthorization.getElement());
