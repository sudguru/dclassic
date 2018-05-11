const express = require('express');
const router = express.Router();
const generalData = require('../config/generalData');
const steem = require('steem');
const moment = require("moment");

// Home Route
router.get('/', function(req, res){
  latests = [];
  trending = [];
  hot = [];
  getCreated()
  .then(getHot)
  .then(getTrending)
  .then(trending)
  .then(() => {
    //console.log('xxx')
    res.render('index', { latests, hot, trending })
  });
  //res.render('index', { latests, hot, trending })
});

router.get('/category/:categoryname', function(req, res) {

});

router.get('/video/:author', function(req, res) {

});

router.get('/video/:permlink/:author', function(req, res) {
  const author = req.params.author;
  const permlink = req.params.permlink;
  steem.api.getContent(author, permlink, function(err, result) {
    json_metadata = JSON.parse(result.json_metadata);
    paymentValue = parseFloat(result.total_payout_value) +
                        parseFloat(result.curator_payout_value) +
                        parseFloat(result.pending_payout_value);

    posted = moment(result.created).fromNow();
    duration = moment.utc(json_metadata.video.video_duration*1000).format('mm:ss'),
    pv = '$ ' + paymentValue.toFixed(2);
      let video = {
        title: result.title,
        thumbnail : generalData.SERVER_NAME + '/uploads/' + json_metadata.video.thumbnail_path,
        videopath : generalData.SERVER_NAME + '/uploads/' + json_metadata.video.video_path,
        duration: duration,
        author: result.author,
        payment: pv,
        posted: posted,
        permlink: permlink
    }
    let voters = [];
    result.active_votes.forEach(ac => {
      voters.push(ac.voter);
    })
    console.log(voters)
    tags = json_metadata.video.categories.split(",");
    res.render('video', { video, voters, tags });
  });
});
router.get('/hot', function(req,res) {

});

router.get('/trending', function(req,res) {

});

router.get('/new', function(req,res) {

})

router.get('/subscriptions', function(req, res) {

});

router.get('/history', function(req, res) {

});

router.get('/liked', function(req, res) {

});

router.get('/watchlater', function(req, res) {

});

router.get('/video/:videotype', function(req, res) {

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
              posted: posted,
              permlink: element.permlink
            }
            data.push(item);
        });
        latests = data;
        //console.log('l', latests)
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
              posted: posted,
              permlink: element.permlink
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
              posted: posted,
              permlink: element.permlink
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


