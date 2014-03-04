var loginEl = document.querySelector('.login'),
    logoutEl = document.querySelector('.logout'),
    usernameEl = document.querySelector('.username');

var auth = new WebmakerAuthClient();

auth.on('login', function(data, message) {
  usernameEl.innerHTML = data.email;
});

auth.on('logout', function() {
  usernameEl.innerHTML = '';
});

auth.on('error', function(err) {
  console.error(err);
});

auth.verify();

loginEl.addEventListener('click', auth.login, false);
logoutEl.addEventListener('click', auth.logout, false);
