const express = require('express');
const router = express.Router();
const generalData = require('../config/generalData');
const steem = require('steem');
const moment = require("moment");
var jwt_decode = require('jwt-decode');
var util = require('util');
router.get('/test', (req, res) => {
  res.render('test.pug');
});

// Home Route
router.get('/', function(req, res){
  latests = [];
  trending = [];
  hot = [];
  // getCreated()
  // .then(getHot)
  // .then(getTrending)
  // .then(trending)
  // .then(() => {
  //   console.log('xxx')
  //   res.render('index', { latests, hot, trending })
  // });
  res.render('index', { latests, hot, trending })
  
});

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
    res.redirect('/');
  });
});


//from steemconnect
router.get('/connect', function(req, res){
  var access_token = req.query.access_token;
  var expires_in = req.query.expires_in;
  var state = req.query.state;
  SCapi.setAccessToken(access_token)
  state = state == 'index' ? '' : state;
  var decoded = jwt_decode(access_token);
  //console.log('dfg' + util.inspect(decoded, false, null));
  var currentTimestamp = moment(new Date()).format('X');
  var expirationTimestamp = decoded.exp - 86400; //1 day buffer
  req.session.username = decoded.user;
  req.session.expirationTimestamp = expirationTimestamp;
  res.redirect('/'+state);
});


const getCreated = function() {
  const promise = new Promise(function(resolve, reject) {
    let data = [];
    let json_metadata = {};
    let paymentValue = 0;
    let posted = '';
    let duration = '';
    let pv = '';
    var query = {
      tag: 'dpornclassicvideo',
      limit: 10,
      filter_tags: ["test"],
      truncate_body: 1
    };
    steem.api.getDiscussionsByCreated(query, function(err, result) {
      if(!err) {
        result.forEach(element => {
          json_metadata = JSON.parse(element.json_metadata);
          paymentValue = parseFloat(element.total_payout_value) +
                              parseFloat(element.curator_payout_value) +
                              parseFloat(element.pending_payout_value);
  
          posted = moment(element.created).fromNow();
          duration = moment.utc(json_metadata.video.video_duration*1000).format('mm:ss')

          pv = '$ ' + paymentValue.toFixed(2);
            let item = {
              title: element.title,
              thumbnail: json_metadata.video.thumbnail_path,
              duration: duration,
              author: element.author,
              payment: pv,
              posted: posted
            }
            data.push(item);
        });
        latests = data;
        console.log('l', latests)
        resolve(1);
      } else {
        resolve(0);
      }
    });
  });
  return promise;
};

const getHot = function() {
  const promise = new Promise(function(resolve, reject) {
    let data = [];
    var query = {
      tag: 'dpornclassicvideo',
      limit: 10,
      filter_tags: ["test"],
      truncate_body: 1
    };
    steem.api.getDiscussionsByHot(query, function(err, result) {
      if(!err) {
        result.forEach(element => {
          json_metadata = JSON.parse(element.json_metadata);
          paymentValue = parseFloat(element.total_payout_value) +
                              parseFloat(element.curator_payout_value) +
                              parseFloat(element.pending_payout_value);
  
          posted = moment(element.created).fromNow();
          duration = moment.utc(json_metadata.video.video_duration*1000).format('mm:ss')

          pv = '$ ' + paymentValue.toFixed(2);
            let item = {
              title: element.title,
              thumbnail: json_metadata.video.thumbnail_path,
              duration: duration,
              author: element.author,
              payment: pv,
              posted: posted
            }
            data.push(item);
        });
        hot = data;
        resolve(1);
      } else {
        resolve(0);
      }
    });
  });
  return promise;
};

const getTrending = function() {
  const promise = new Promise(function(resolve, reject) {
    let data = [];
    var query = {
      tag: 'dpornclassicvideo',
      limit: 10,
      filter_tags: ["test"],
      truncate_body: 1
    };
    steem.api.getDiscussionsByTrending(query, function(err, result) {
      if(!err) {
        result.forEach(element => {
          json_metadata = JSON.parse(element.json_metadata);
          paymentValue = parseFloat(element.total_payout_value) +
                              parseFloat(element.curator_payout_value) +
                              parseFloat(element.pending_payout_value);
  
          posted = moment(element.created).fromNow();
          duration = moment.utc(json_metadata.video.video_duration*1000).format('mm:ss')

          pv = '$ ' + paymentValue.toFixed(2);
            let item = {
              title: element.title,
              thumbnail: json_metadata.video.thumbnail_path,
              duration: duration,
              author: element.author,
              payment: pv,
              posted: posted
            }
            data.push(item);
        });
        trending = data;
        resolve(1);
      } else {
        resolve(1);
      }
    });
  });
  return promise;
};


module.exports = router;


