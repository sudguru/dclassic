const express = require('express');
const router = express.Router();
const generalData = require('../config/generalData');
const steem = require('steem');

router.get('/test', (req, res) => {
  res.render('test.pug');
});

// Home Route
router.get('/', function(req, res){
  var query = {
    tag: 'dpornclassicvideo',
    limit: 10,
    filter_tags: ["test"],
    truncate_body: 1
  };
  let latests = [];
  steem.api.getDiscussionsByCreated(query, function(err, result) {
    if(!err) {
      result.forEach(element => {
        let json_metadata = JSON.parse(element.json_metadata);
          let item = {
            title: element.title,
            thumbnail: json_metadata.video.thumbnail_path,
            duration: json_metadata.video.video_duration,
            author: element.author
          }
          latests.push(item);
      });
    }
  });
  res.render('index', { latests });
});

//login
router.get('/login', function(req, res) {
  var state = req.query.state;
  var link = req.app.locals.SCapi.getLoginURL(state);
  console.log('link is', link);
  res.writeHead(301, { Location: link });
  res.end();
});


//logout
router.get('/logout', function(req, res) {
  req.app.locals.SCapi.revokeToken(function (error, result) {
  req.session.username = null;
  req.session.filename = null;
  res.redirect('/');
  });
});


//from steemconnect
router.get('/connect', function(req, res){
  var access_token = req.query.access_token;
  var expires_in = req.query.expires_in;
  var state = req.query.state;
  req.app.locals.SCapi.setAccessToken(access_token)
  state = state == 'new' ? '' : state;
  res.redirect('/'+state);

});


// Access Control
function ensureAuthenticated(req, res, next){

  if(req.session.username){
    if(generalData.usersAllowedToUpload.indexOf(req.session.username)>=0)
    {
      return next();
    } else {
      req.flash('danger', 'Sorry You are not allowed to upload');
      res.redirect('/');
    }
  } else {
    req.flash('danger', 'Please login');
    res.redirect('/login?state=upload');
  }
}

module.exports = router;


