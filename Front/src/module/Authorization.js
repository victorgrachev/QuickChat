import _ from 'lodash';
import '../styles/Authorication.css';

function Authorization({ onSubmit }) {
  const sShablonAuthorization = `<div class="login">
                                    <h1>Sign in</h1>
                                      <form>
                                          <p>
                                              <input
                                              type="text"
                                              name="login"
                                              value=""
                                              placeholder="Username or Email"
                                              />
                                          </p>
                                          <p class="remember_me">
                                              <label>
                                              <input type="checkbox" name="remember_me" id="remember_me" />
                                              Remember me on this computer
                                              </label>
                                          </p>
                                          <p class="submit">
                                              <input type="submit" name="commit" value="Login" />
                                          </p>
                                      </form>
                                  </div>`;

  function render() {
    const oElementAuthorization = _.template(sShablonAuthorization)();

    const oRootElement = document.createElement('div');
    oRootElement.classList.add('authorizate');
    oRootElement.innerHTML = oElementAuthorization;

    const oForm = oRootElement.querySelector('form');
    oForm.addEventListener('submit', (event) => {
      if (onSubmit) {
        onSubmit(event);
      }
    });
    return oRootElement;
  }

  this.render = render;
}

export default Authorization;
