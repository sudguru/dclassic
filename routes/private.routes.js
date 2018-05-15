const express = require('express');
const router = express.Router();
const moment = require("moment");

var PrivateController = require('../controllers/private.controller');

router.post('/follow/:username/:author', ensureAuthenticated, PrivateController.followAuthor);
router.post('/upvote/:username/:author/:permlink', ensureAuthenticated, PrivateController.upVote);
router.post('/gift/:sendto/:amount/:currency/:permlink', ensureAuthenticated, PrivateController.sendGift)
router.get('/history', ensureAuthenticated, PrivateController.listHistory);
router.get('/liked', ensureAuthenticated, PrivateController.listLiked);
router.get('/watchlater', ensureAuthenticated, PrivateController.listWatchLater);

function ensureAuthenticated(req, res, next) {
  let username = req.session.username;
  let expirationTimestamp = req.session.expirationTimestamp
  let currentTimestamp = moment(new Date()).format('X');
  let validUser = (expirationTimestamp > currentTimestamp) ? true : false;
  console.log(validUser)
  console.log(username)
  if (username && validUser) {
      return next();
  } else {
    redirectPath = 'private' + req.path;
    if(redirectPath.split('/').length > 1) {
      res.status(200).send({ error: 'Error', result: null })
    } else {
      res.redirect('/auth/login?state='+redirectPath);
    }
  }
}
module.exports = router;