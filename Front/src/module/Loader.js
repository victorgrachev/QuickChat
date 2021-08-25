import '../styles/Loader.css';

function Loader() {
  const shablonLoader = `<div class="lds-dual-ring"></div>`;

  function render() {
    const root = document.createElement('div');
    root.classList.add('loader');
    root.innerHTML = shablonLoader;
    return root;
  }

  this.render = render;
}

export default Loader;
