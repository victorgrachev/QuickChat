function User() {
  const usersDb = [];

  function getUsers() {
    return usersDb.map((user) => user);
  }

  function getUser(id) {
    const indx = usersDb.findIndex((user) => user.id === id);
    return usersDb[indx];
  }

  function deleteUser(id) {
    const indx = usersDb.findIndex((user) => user.id === id);

    if (indx != -1) {
      usersDb.splice(indx, 1);
    }
  }

  function setOnline(id, online) {
    const indx = usersDb.findIndex((user) => user.id === id);

    if (indx != -1) {
      usersDb[indx].online = online;
    }
  }

  function setRemember(id, remember) {
    const indx = usersDb.findIndex((user) => user.id === id);

    if (indx != -1) {
      usersDb[indx].remember = remember;
    }
  }

  function createUser(name, online, remember, err) {
    const newUser = {
      id: new Date().getTime().toString(36),
      name,
      online,
      remember,
    };

    const indx = usersDb.findIndex((user) => user.name === name);

    if (indx === -1) {
      usersDb.push(newUser);

      if (newUser.remember) {
        setTimeout(() => {
          const user = this.getUser(newUser.id);

          if (!user.online) {
            this.deleteUser(newUser.id);
          } else {
            this.setRemember(newUser.id, false);
          }
        }, 5000);
      }

      return newUser;
    } else {
      err(usersDb[indx].id);
    }
  }

  this.getUsers = getUsers;
  this.getUser = getUser;
  this.createUser = createUser;
  this.deleteUser = deleteUser;
  this.setOnline = setOnline;
  this.setRemember = setRemember;
}

module.exports = User;
