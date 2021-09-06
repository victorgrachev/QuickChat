import '../styles/Authorication.css';

function Authorization(onSubmit) {
  const shablonAuthorization = `<div class="login">
                                    <h1>Sign in</h1>
                                      <form>
                                          <p>
                                              <input
                                              id="nickname"
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
                                              <input id="registration" type="submit" name="commit" value="Login" />
                                          </p>
                                      </form>
                                  </div>`;

  function render() {
    const root = document.createElement('div');
    root.classList.add('authorizate');
    root.innerHTML = shablonAuthorization;
    if (onSubmit) {
      const form = root.querySelector('form');
      form.addEventListener('submit', (event) => onSubmit(event));
    }

    return root;
  }

  this.render = render;
}

export default Authorization;
