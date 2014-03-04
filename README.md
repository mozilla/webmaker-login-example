# Webmaker Login Example

This repository is to be used as a reference for implementing [Webmaker](https://webmaker.org) Authentication in a node/express/nunjucks application

Points of interest (look for inline comments explaining what to do):
* [app.js - express server setup and configuration](https://github.com/mozilla/webmaker-login-example/blob/master/app.js)
* [index.html - how to set up the front end](https://github.com/mozilla/webmaker-login-example/blob/master/views/index.html)
* [login-example.js - using the webmaker-auth-client JS API](https://github.com/mozilla/webmaker-login-example/blob/master/public/js/login-example.js)
* [login-example.css - how to include the create user form less file](https://github.com/mozilla/webmaker-login-example/blob/master/public/css/login-example.less)

#### Required npm modules:
* [bower](https://www.npmjs.org/package/bower)
* [express](https://www.npmjs.org/package/express)
* [less-middleware](https://www.npmjs.org/package/less-middleware)
* [nunjucks](https://www.npmjs.org/package/nunjucks)
* [webmaker-auth](https://www.npmjs.org/package/webmaker-auth)
* [webmaker-i18n](https://github.com/mozilla/node-webmaker-i18n/)
* [webmaker-locale-mapping](https://www.npmjs.org/package/webmaker-locale-mapping)

#### Optional npm modules:
* [habitat](https://www.npmjs.org/package/habitat)
* [helmet](https://www.npmjs.org/package/helmet)

#### Required bower module:
* [webmaker-auth-client](https://github.com/mozilla/webmaker-auth-client)


## setup

1. `git clone https://github.com/mozilla/webmaker-login-example.git`
2. `npm install`
3. `cp env.dist .env`
4. `node app`

## More

For further configuration options and details, read the [webmaker-auth README](https://github.com/mozilla/webmaker-auth) and the [webmaker-auth-client README](https://github.com/mozilla/webmaker-auth-client)
