const express = require('express');
const router = express.Router();

var PrivateController = require('../controllers/private.controller');

router.post('/follow/:username/:author', ensureAuthenticated, PrivateController.followAuthor);
router.post('/upvote/:username/:author/:permlink', ensureAuthenticated, PrivateController.upVote);
router.get('/history', ensureAuthenticated, ensureAuthenticated, PrivateController.listHistory);
router.get('/liked', ensureAuthenticated, ensureAuthenticated, PrivateController.listLiked);
router.get('/watchlater', ensureAuthenticated, PrivateController.listWatchLater);

function ensureAuthenticated(req, res, next) {
  let username = req.session.username;
  let expirationTimestamp = req.session.expirationTimestamp
  console.log(expirationTimestamp);
  let currentTimestamp = moment(new Date()).format('X');
  console.log(currentTimestamp);
  let validUser = (expirationTimestamp > currentTimestamp) ? true : false;
  console.log(validUser)
  console.log(username)
  if (username && validUser) {
    if (generalData.usersAllowedToUpload.indexOf(username) >= 0) {
      return next();
    } else {
      res.redirect('/?msg=Sorry You are not Authorized to upload.');
    }
  } else {
    redirectPath = req.path;
    res.redirect('/auth/login?state=' + redirectPath);
  }
}
module.exports = router;