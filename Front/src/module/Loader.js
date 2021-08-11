import _ from 'lodash';
import '../styles/Loader.css';

function Loader() {
  let oLoaderElement;
  const sShablonHTML = `<div class="lds-dual-ring"></div>`;

  function render() {
    const oElementHTML = _.template(sShablonHTML)();
    const oElement = document.createElement('div');
    oElement.classList.add('loader');
    oElement.innerHTML = oElementHTML;
    return oElement;
  }

  function getElement() {
    if (!oLoaderElement) {
      oLoaderElement = render();
    }
    return oLoaderElement;
  }

  this.getElement = getElement;
}

export default Loader;
