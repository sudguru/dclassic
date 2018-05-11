const express = require('express');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const sc2 = require('sc2-sdk');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const config = require('./config/database');
const generalData = require('./config/generalData');

mongoose.connect(config.database);
let db = mongoose.connection;

// Check DB connection & Error 
db.once('open', function(){
  console.log('Connected to MongoDB');
});
db.on('error', function(err){
  console.log(err);
});

// Init App
const app = express();
app.set('env', 'development');

//steemconnect v2 api
SCapi = sc2.Initialize({
  app: 'steemporn.app',
  callbackURL: generalData.SERVER_NAME + '/connect',
  scope: ['vote', 'comment', 'delete_comment', 'comment_options', 'custom_json', 'claim_reward_balance']
});

// Load View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Body Parser parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// Set Public Folder
app.use(express.static(path.join(__dirname, 'public')));

// Express Session Middleware with connect-mongoose
app.use(session({
  secret: 'my top secret',
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
  cookie: { expires: 604800 }
}));


//Morgan Logging
var accessLogStream = fs.createWriteStream(path.join(__dirname, 'logs/access.log'), {flags: 'a'})
app.use(morgan(function (tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '--',
    'username' , '--',
    new Date() , '--',
    tokens['response-time'](req, res), 'ms'
  ].join(' ')
}, {stream: accessLogStream}));

app.get('*', function(req, res, next){
    res.locals.username = req.session.username || null;
    console.log('s', res.locals.username)
    console.log('q', req.session.username);
    next();
});

let site = require('./routes/site.routes');
app.use('/', site);
let upload = require('./routes/upload.routes');
app.use('/upload', upload);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.send(err.message);
});

function ensureAuthenticated(req, res, next){
  let username = localStorage.getItem('dpc_username');
  let expirationTimestamp = localStorage.getItem('dpc_expiration');
  let currentTimestamp = moment(new Date()).format('X');
  let validUser = (currentTimestamp > expirationTimestamp) ? true : false;
  if(validUser){
    if(generalData.usersAllowedToUpload.indexOf(username) >= 0 )
    {
      return next();
    } else {
      res.redirect('/?msg=Sorry You are not Authorized to upload.');
    }
  } else {
    redirectPath = req.path;
    res.redirect('/login?state='+redirectPath);
  }
}
module.exports = app;
