const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const config = require('./config/database');
var sc2 = require('sc2-sdk');
let access_token = null;

var api = sc2.Initialize({
  app: 'steemporn.app',
  callbackURL: 'http://localhost:8080/connect',
  scope: ['vote', 'comment']
});



mongoose.connect(config.database);
let db = mongoose.connection;

// Check connection
db.once('open', function(){
  console.log('Connected to MongoDB');
});

// Check for DB errors
db.on('error', function(err){
  console.log(err);
});

// Init App
const app = express();

// Load View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Body Parser Middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// Set Public Folder
app.use(express.static(path.join(__dirname, 'public')));

// Express Session Middleware
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}));

// Express Messages Middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// Express Validator Middleware
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));


// Home Route
app.get('/', function(req, res){
      var link = api.getLoginURL('state');
      console.log(link)
      res.render('index1', { link });
});

app.get('/connect', function(req, res){

  var access_token = req.query.access_token;
  var expires_in = req.query.expires_in;
  var state = req.query.state;
  var username = req.query.username
  api.setAccessToken(access_token)
  console.log(username);
  console.log(access_token);
  api.me(function (err, res) {
    console.log(err, res);
  });
  res.render('complete');
});

app.get('/test', function(req, res){
  api.me(function (err, res) {
    console.log(err, 'ereer', res);
  });
  res.render('index1');
});

//http://localhost:8080/connect?access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYXBwIiwicHJveHkiOiJzdGVlbXBvcm4uYXBwIiwidXNlciI6InN1ZGd1cnUiLCJzY29wZSI6WyJ2b3RlIiwiY29tbWVudCJdLCJpYXQiOjE1MjU0NDE4ODAsImV4cCI6MTUyNjA0NjY4MH0.n-ze7mg0cTR7uNEB5u0PFPnBNSdlMKgMD-NRJRKfF1Y&expires_in=604800&state=state&username=sudguru

// Route Files
let video = require('./routes/video');
app.use('/video', video);


// // Start Server
// app.listen(8080, function(){
//   console.log('Server started on port 3000...');
// });

module.exports = app;
