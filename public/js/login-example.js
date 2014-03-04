var loginEl = document.querySelector('.login'),
    logoutEl = document.querySelector('.logout'),
    usernameEl = document.querySelector('.username');

// set up the WebmakerAuthClient
// for a list of all options visit https://github.com/mozilla/webmaker-auth-client#configure
var auth = new WebmakerAuthClient();

// Specify a callback function for when the auth client successfully authenticates
auth.on('login', function(data, message) {
  usernameEl.innerHTML = data.email;
});

// Specify a callback function for when the auth client successfully logs out
auth.on('logout', function() {
  usernameEl.innerHTML = '';
});

// If there's an error logging in, run the specified callback
auth.on('error', function(err) {
  console.error(err);
});

// Verify confirms with the app server that the current session cookie is valid
// verify can trigger a login or logout event based on the server's response.
auth.verify();

// Assign the login and logout actions on the webmaker auth client API to the log-in and log-out buttons
loginEl.addEventListener('click', auth.login, false);
logoutEl.addEventListener('click', auth.logout, false);
