import _ from 'lodash';
import '../styles/Loader.css';

function Loader() {
  const sShablonLoader = `<div class="lds-dual-ring"></div>`;

  function render() {
    const oRenderShablon = _.template(sShablonLoader)();

    const oRootElement = document.createElement('div');
    oRootElement.classList.add('loader');
    oRootElement.innerHTML = oRenderShablon;

    return oRootElement;
  }

  this.render = render;
}

export default Loader;
