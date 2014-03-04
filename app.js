var express = require('express'),
    Habitat = require('habitat'),
    helmet = require('helmet'),
    path = require('path'),
    i18n = require('webmaker-i18n'),
    lessMiddleware = require('less-middleware'),
    nunjucks    = require('nunjucks');

// STEP 1:
// load the webmaker-auth middleware module
var WebmakerLogin = require('webmaker-auth');

Habitat.load();

var env = new Habitat(),
    app = express();

// STEP 2:
// add the webmaker-auth-client bower folder to your nunjucks path.
// This will allow you to include the create user form template inside your views
//
// The Create User Form also needs the instantiate filter defined below
var nunjucksEnv = new nunjucks.Environment([
  new nunjucks.FileSystemLoader(__dirname + '/views'),
  new nunjucks.FileSystemLoader(__dirname + '/bower_components')
], {
  autoescape: true
});

// STEP 3:
// Add an instantiate filter to your nunjucks environment
// TODO: find a way to make this easier!!
nunjucksEnv.addFilter("instantiate", function(input) {
    var tmpl = new nunjucks.Template(input);
    return tmpl.render(this.getVariables());
});

// STEP 4:
// The create user form is localisable, and if you're going to include it,
// you must include the webmaker-i18n and webmaker-locale-mapping modules in your project
app.use(i18n.middleware({
  supported_languages: env.get("SUPPORTED_LANGS"),
  default_lang: "en-US",
  mappings: require("webmaker-locale-mapping"),
  translation_directory: path.resolve(__dirname, "locale")
}));

// STEP 5:
// Use the addLocaleObject function of webmaker-i18n to merge create user form localisations
// with matching languages in this app. (only doing en_US here for simplicity)
var authLocaleJSON = require("./bower_components/webmaker-auth-client/locale/en_US/create-user-form.json");
i18n.addLocaleObject({
  "en-US": authLocaleJSON
}, function (result) {});

nunjucksEnv.express( app );
app.disable( "x-powered-by" );

// STEP 6:
// Setup the webmaker-auth middleware module,
// passing in the login API's hostname (including basic authentication credentials)
// and a string for encrypting session cookies.
//
// For environments other than localhost, you can provide a domain to use for the
// session cookie (allowing SSO if other apps on the TLD share the secret key)
//
// set FORCE_SSL to true to enable HttpOnly for session Cookies
var login = new WebmakerLogin({
  loginURL: env.get('LOGIN_URL'),
  secretKey: env.get('SECRET_KEY'),
  domain: env.get('DOMAIN', null),
  forceSSL: env.get('FORCE_SSL', false)
});

app.use( helmet.iexss() );
app.use( helmet.contentTypeOptions() );
app.use( helmet.xframe() );

if ( !!env.get( "FORCE_SSL" ) ) {
  app.use( helmet.hsts() );
  app.enable( "trust proxy" );
}

app.use(express.logger('dev'));
app.use(express.compress());
app.use(express.json());
app.use(express.urlencoded());

// STEP 7:
// substitute express' cookieParser and cookieSession middleware for the webmaker-auth modules middleware
// (it's uses the former, with added configuration for webmaker-auth)
app.use(login.cookieParser());
app.use(login.cookieSession());

var optimize = env.get('NODE_ENV') !== 'development',
    tmpDir = path.join(require('os' ).tmpDir(), 'mozilla.webmaker-login-example.build');

// STEP 8:
// Use Less Middleware to parse the webmaker-auth-client's create user form less file to CSS
app.use(lessMiddleware({
  once: optimize,
  debug: !optimize,
  dest: tmpDir,
  // NOTE: we'll use a LESS include in our public/css to include the create user form styles
  src: __dirname + '/public',
  compress: optimize,
  yuicompress: optimize,
  optimization: optimize ? 0 : 2
}));

app.use(express.static(tmpDir));

// STEP 9:
// set up the webmaker-auth routes using the handler functions.
// Include any additional middleware you may need.
//
// If you don't need additional middleware, you can optionally pass your
// express instance into the login.bind() function to do exactly what's being done below
app.post('/verify', login.handlers.verify);
app.post('/authenticate', login.handlers.authenticate);
app.post('/create', login.handlers.create);
app.post('/logout', login.handlers.logout);
app.post('/check-username', login.handlers.exists);

app.get('/', function(req, res) {
  res.render('index.html');
});

app.use(express.static(__dirname + '/public'));

// STEP 10:
// Statically serve the webmaker-auth-client bower module, so the front end can use it
app.use('/bower', express.static(__dirname + '/bower_components'));

// STEP 11:
// ( IMPORTANT! )
// Ensure that this app's hostname+port is whitelisted on the target Login API server!
// i.e. add ALLOWED_DOMAINS="http://localhost:5000" to the login server environment config
var port = env.get('PORT', 5000)
app.listen(port, function() {
  console.log('App listening on ' + port);
});
