const generalData = require('../config/generalData');
const steem = require('steem');
const moment = require("moment");


exports.upVote = (req, res, next) => {
  let voter = req.params.username;
  let author = req.params.author;
  let permlink = req.params.permlink;
  SCapi.vote(voter, author, permlink, 10000, function (err, response) {
    if(err) {
      res.status(200).send({ error: err.message, result: null })
    } else {
      res.status(200).json({ error: null, result: voter});
    }
  });
}


exports.followAuthor = (req, res, next) => {
  let follower = req.params.username;
  let following = req.params.author;
  SCapi.follow(follower, following, function (err, result) {
    if(err) {
      res.status(200).send({ error: err.message, result: null });
    } else {
      res.status(200).send({ error: null, result: 'success' });
    }
  });
}


exports.listHistory = (req, res, next) => {
  let history = [];
  res.render('listing', { title: "History", videos: history });
}


exports.listLiked = (req, res, next) => {
  let liked = [];
  res.render('listing', { title: "History", videos: liked });
}


exports.listWatchLater = (req, res, next) => {
  let watchlater = [];
  res.render('listing', { title: "History", videos: watchlater });
}