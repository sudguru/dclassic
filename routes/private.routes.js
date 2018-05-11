const express = require('express');
const router = express.Router();
const generalData = require('../config/generalData');
const steem = require('steem');
const moment = require("moment");


router.get('/subscriptions', ensureAuthenticated, function(req, res) {

});

router.get('/history', ensureAuthenticated, function(req, res) {

});

router.get('/liked', ensureAuthenticated, function(req, res) {

});

router.get('/watchlater', ensureAuthenticated, function(req, res) {

});

router.get('/video/:videotype', ensureAuthenticated, function(req, res) {

});

function ensureAuthenticated(req, res, next){
    let username = req.session.username;
    let expirationTimestamp = req.session.expirationTimestamp
    console.log(expirationTimestamp);
    let currentTimestamp = moment(new Date()).format('X');
    console.log(currentTimestamp);
    let validUser = (expirationTimestamp > currentTimestamp) ? true : false;
    console.log(validUser)
    console.log(username)
    if(username && validUser){
      if(generalData.usersAllowedToUpload.indexOf(username) >= 0 )
      {
        return next();
      } else {
        res.redirect('/?msg=Sorry You are not Authorized to upload.');
      }
    } else {
      redirectPath = req.path;
      res.redirect('/auth/login?state='+redirectPath);
    }
  }
module.exports = router;


