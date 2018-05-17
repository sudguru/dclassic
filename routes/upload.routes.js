const express = require('express');
const router = express.Router();
const generalData = require('../config/generalData');
const CanUpload = require('../models/canupload.model');
const moment = require('moment');

var UploadController = require('../controllers/upload.controller');


router.get('/', ensureAuthenticated, UploadController.showUploadForm);
router.post('/', ensureAuthenticated, UploadController.uploadVideo);
router.post('/save', ensureAuthenticated, UploadController.savePost);

function ensureAuthenticated(req, res, next){
  let username = req.session.username;
  let expirationTimestamp = req.session.expirationTimestamp
  let currentTimestamp = moment(new Date()).format('X');
  let validUser = (expirationTimestamp > currentTimestamp) ? true : false;
  console.log(validUser)
  console.log(username)
  if(username && validUser){
    CanUpload.find({}, (error, result) => {

      const usersAllowedToUpload = result.map(user => user.username)
      if(usersAllowedToUpload.indexOf(username) >= 0 )
      {
        return next();
      } else {
        res.redirect('/?msg=1');
      }
    });
    
  } else {
    res.redirect('/auth/login?state=upload');
  }
}

  module.exports = router;