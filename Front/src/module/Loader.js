import '../styles/Loader.css';

function Loader() {
  const sShablonLoader = `<div class="lds-dual-ring"></div>`;

  function render() {
    const oRootElement = document.createElement('div');
    oRootElement.classList.add('loader');
    oRootElement.innerHTML = sShablonLoader;

    return oRootElement;
  }

  this.render = render;
}

export default Loader;
