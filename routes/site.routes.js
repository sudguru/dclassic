const express = require('express');
const router = express.Router();
const generalData = require('../config/generalData');
const steem = require('steem');
const moment = require("moment");
const Video = require('../models/video.model');
const Hot = require('../models/hot.model');
const Trending = require('../models/trending.model');

// Home Route
router.get('/', function(req, res){
  latests = [];
  trending = [];
  hot = [];
  getCreated()
  .then(getHot)
  .then(getTrending)
  .then(() => {
    console.log(hot)
    res.render('index', { latests, hot, trending })
  });

});

router.get('/category/:categoryname', function(req, res) {

});

router.get('/profile/:author', function(req, res) {
  const author = req.params.author;
  let voting_power;
  steem.api.getAccounts([author], function(err, response){
    voting_power = response.voting_power;
    console.log(voting_power);
    res.render("profile", { 
      cover_image: 'abc',
      voting_power: voting_power
    });
  });

  
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
      if(ac.percent > 0) {
        voters.push(ac.voter);
      }
    })
    console.log(voters)
    tags = json_metadata.video.categories.split(",");
    res.render('video', { video, voters, tags });
  });
});


router.get('/hot', function(req,res) {
  var query = {
    limit: 50,
  };
  Hot.find({}, function(err, videos){
    if(err){
      logError(err, 'Site hot find 120');
    } else {
      //tasks
      hot = videos.map(video => {
        posted = moment(video.posteddate).fromNow();
        duration = moment.utc(video.video_duration*1000).format('mm:ss');
        const v = {
          title: video.title,
          thumbnail : generalData.SERVER_NAME + '/uploads/' + video.thumbnail_path,
          videopath : generalData.SERVER_NAME + '/uploads/' + video.video_path,
          duration: duration,
          author: video.author,
          payment: '$ ' + video.payment,
          posted: posted,
          permlink: video.permlink
        }
        return v;
      });
      res.render('listing', { title: "Hot Videos", videos: hot })
    }
  });
});

router.get('/trending', function(req,res) {
  var query = {
    limit: 50,
  };
  Trending.find({}, function(err, videos){
    if(err){
      logError(err, 'Site hot find 120');
    } else {
      //tasks
      trending = videos.map(video => {
        posted = moment(video.posteddate).fromNow();
        duration = moment.utc(video.video_duration*1000).format('mm:ss');
        const v = {
          title: video.title,
          thumbnail : generalData.SERVER_NAME + '/uploads/' + video.thumbnail_path,
          videopath : generalData.SERVER_NAME + '/uploads/' + video.video_path,
          duration: duration,
          author: video.author,
          payment: '$ ' + video.payment,
          posted: posted,
          permlink: video.permlink
        }
        return v;
      });
      res.render('listing', { title: "Trending Videos", videos: trending })
    }
  });
});

router.get('/new', function(req,res) {
  var query = {
    limit: 50,
    sort: '-posteddate'
  };
  Video.find({}, function(err, videos){
    if(err){
      logError(err, 'Site hot find 120');
    } else {
      //tasks
      latests = videos.map(video => {
        posted = moment(video.posteddate).fromNow();
        duration = moment.utc(video.video_duration*1000).format('mm:ss');
        const v = {
          title: video.title,
          thumbnail : generalData.SERVER_NAME + '/uploads/' + video.thumbnail_path,
          videopath : generalData.SERVER_NAME + '/uploads/' + video.video_path,
          duration: duration,
          author: video.author,
          payment: '$ ' + video.payment,
          posted: posted,
          permlink: video.permlink
        }
        return v;
      });
      res.render('listing', { title: "New Videos", videos: latests })
    }
  });
})

router.get('/video/:videotype', function(req, res) {

});

const getCreated = function() {
  const promise = new Promise(function(resolve, reject) {
    var query = {
      limit: 10,
    };
    Video.find({}, function(err, videos){
      if(err){
        logError(err, 'Site Video Find 87')
        resolve(0)
      } else {
        //tasks
        latests = videos.map(video => {
          posted = moment(video.posteddate).fromNow();
          duration = moment.utc(video.video_duration*1000).format('mm:ss');
          const v = {
            title: video.title,
            thumbnail : generalData.SERVER_NAME + '/uploads/' + video.thumbnail_path,
            videopath : generalData.SERVER_NAME + '/uploads/' + video.video_path,
            duration: duration,
            author: video.author,
            payment: '$ ' + video.payment,
            posted: posted,
            permlink: video.permlink
          }
          return v;
        });
        resolve(1)
      }
    });
  });
  return promise;
};

const getHot = function() {
  const promise = new Promise(function(resolve, reject) {
    var query = {
      limit: 10,
    };
    Hot.find({}, function(err, videos){
      if(err){
        logError(err, 'Site hot find 120');
        resolve(0)
      } else {
        //tasks
        hot = videos.map(video => {
          posted = moment(video.posteddate).fromNow();
          duration = moment.utc(video.video_duration*1000).format('mm:ss');
          const v = {
            title: video.title,
            thumbnail : generalData.SERVER_NAME + '/uploads/' + video.thumbnail_path,
            videopath : generalData.SERVER_NAME + '/uploads/' + video.video_path,
            duration: duration,
            author: video.author,
            payment: '$ ' + video.payment,
            posted: posted,
            permlink: video.permlink
          }
          return v;
        });
        resolve(1)
      }
    });
  });
  return promise;
};

const getTrending = function() {
  const promise = new Promise(function(resolve, reject) {
    var query = {
      limit: 10,
    };
    Trending.find({}, function(err, videos){
      if(err){
        logError(err, 'Site Trending Find 153');
        resolve(0)
      } else {
        //tasks
        trending = videos.map(video => {
          posted = moment(video.posteddate).fromNow();
          duration = moment.utc(video.video_duration*1000).format('mm:ss');
          const v = {
            title: video.title,
            thumbnail : generalData.SERVER_NAME + '/uploads/' + video.thumbnail_path,
            videopath : generalData.SERVER_NAME + '/uploads/' + video.video_path,
            duration: duration,
            author: video.author,
            payment: '$ ' + video.payment,
            posted: posted,
            permlink: video.permlink
          }
          return v;
        });
        resolve(1)
      }
    });
  });
  return promise;
};

const logError = function(err, location) {
  let error = new ErrorLog();
  error.message = err.message;
  error.location = location
  error.posteddate = new Date();
  error.save();
}

module.exports = router;


