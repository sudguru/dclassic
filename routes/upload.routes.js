const express = require('express');
const router = express.Router();
const generalData = require('../config/generalData');

var UploadController = require('../controllers/upload.controller');



router.get('/', ensureAuthenticated, UploadController.showUploadForm);
router.post('/', ensureAuthenticated, UploadController.uploadVideo);
router.post('/save', ensureAuthenticated, UploadController.savePost);


// Access Control
function ensureAuthenticated(req, res, next){
  //const allowed = ['sudguru', 'pranishg'];
  const allowed = generalData.usersAllowedToUpload
  console.log(allowed);
  if(req.session.username){
    if(allowed.indexOf(req.session.username)>=0)
    {
      return next();
    } else {
      req.flash('danger', 'Sorry You are not allowed to upload');
      res.redirect('/');
    }
  } else {
    //req.flash('danger', 'Please login');
    res.redirect('/login?state=upload');
  }
  }

  module.exports = router;