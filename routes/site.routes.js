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
  av = [];
  Video.find({"author": author}, function(err, videos){
    if(err){
      logError(err, 'Site author video find 38');
    } else {
      //tasks
      av = videos.map(video => {
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
    }
  });

  steem.api.getAccounts([author], function(err, response){
    voting_power = response[0].voting_power;
    cover_image='/imgs/cover.jpg';
    about = '';
    profile_image = 'https://img.busy.org/@'+author;
    location = '';
    if(response[0].json_metadata) {
      json_metadata = JSON.parse(response[0].json_metadata);
      console.log(json_metadata);
      cover_image = `https://steemitimages.com/2048x512/${json_metadata.profile.cover_image}`
      about = json_metadata.profile.about;
      profile_image = json_metadata.profile.profile_image;
      location = json_metadata.profile.location
    }
    balance = response[0].balance;
    sbd_balance = response[0].sbd_balance;
    steem.api.getFollowCount(author, function(err1, result) {
      
      res.render("profile", { 
        author: author,
        cover_image: cover_image,
        voting_power: voting_power,
        location: location,
        profile_image: profile_image,
        about: about,
        videos: av,
        follower_count: result.follower_count,
        following_count: result.following_count,
        balance: balance,
        sbd_balance: sbd_balance

      });
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


