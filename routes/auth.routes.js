const express = require('express');
const router = express.Router();
const generalData = require('../config/generalData');
const steem = require('steem');
const moment = require("moment");
var jwt_decode = require('jwt-decode');
//var util = require('util');

//login
router.get('/login', function(req, res) {
  var state = req.query.state;
  var link = SCapi.getLoginURL(state);
  console.log('link is', link);
  res.writeHead(301, { Location: link });
  res.end();
});


//logout
router.get('/logout', function(req, res) {
  SCapi.revokeToken(function (error, result) {
    req.session.username = null;
    req.session.expirationTimestamp = null;
    req.session.token = null;
    res.redirect('/');
  });
});


//from steemconnect
router.get('/', function(req, res){
  var access_token = req.query.access_token;
  var expires_in = req.query.expires_in;
  var state = req.query.state;
  SCapi.setAccessToken(access_token)
  state = state == 'griha' || '/' ? '' : state;
  var decoded = jwt_decode(access_token);
  //console.log('dfg' + util.inspect(decoded, false, null));
  var currentTimestamp = moment(new Date()).format('X');
  var expirationTimestamp = decoded.exp - 86400; //1 day buffer
  req.session.username = decoded.user;
  req.session.expirationTimestamp = expirationTimestamp;
  req.session.token = access_token;
  console.log
  res.redirect('/'+state);
});


module.exports = router;


