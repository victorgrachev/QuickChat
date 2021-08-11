import _ from 'lodash';
import '../styles/Authorication.css';

function Authorization(p_options) {
  let oAuthElement;
  const sShablonHTML = `<div class="login">
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
    const oElementHTML = _.template(sShablonHTML)(p_options);
    const oElement = document.createElement('div');
    oElement.classList.add('authorizate');
    oElement.innerHTML = oElementHTML;
    oElement.querySelector('form').addEventListener('submit', (event) => {
      event.preventDefault();

      if (p_options) {
        p_options.onSubmit(event);
      }
    });
    return oElement;
  }

  function getElement() {
    if (!oAuthElement) {
      oAuthElement = render();
    }
    return oAuthElement;
  }

  this.getElement = getElement;
}

export default Authorization;
