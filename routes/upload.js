var app = require('../app');
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
// Video Model
let Video = require('../models/video');

const storage = multer.diskStorage({
  destination: './public/uploads/',
  filename: function(req, file, cb){
    if(path.extname(file.originalname) == ".mp4") {
      req.session.filename = file.fieldname + '-' + Date.now() + path.extname(file.originalname);
      cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    } else {
      req.session.filename = file.fieldname + '-' + Date.now() + '.jpg';
      cb(null,file.fieldname + '-' + Date.now() + '.jpg');
    }
    
  }
});



const upload = multer({
  storage: storage,
  limits:{fileSize: 1000000000},
  // fileFilter: function(req, file, cb){
  //   checkFileType(file, cb);
  // }
}).fields([
  { name: 'myFile', maxCount: 1 },
  { name: 'myThumb', maxCount: 1 }
]);

// Add Route
//router.get('/', ensureAuthenticated, function(req, res){
  router.get('/', function(req, res){
    res.render('upload', {
      categoryList : [
        'Straight',
        'Lesbian',
        'Gay',
        'Hardcore',
        'Threesome',
        'Group',
        'Blow Job',
        'Asian',
        'Arabic',
        'Anal',
        'Ethenic',
        'Transexual',
        'Amateur'
      ] 
    });
  });

//ensureAuthenticated
router.post('/', (req, res) => {
  upload(req, res, (err) => {
    if(err){
      res.status(500).send('Some Error Occured at Server');
    } else {
      res.send(req.session.filename);    
    }
  });
});

router.post('/save', (req, res) => {
  //console.log(req.body)
  const SERVER = 'http://localhost:8080';

  let videoPost = new Video();
    videoPost.title = req.body.title,
    videoPost.content = req.body.content,
    videoPost.permlink = req.body.permlink,
    videoPost.thumbnail_path = req.body.thumbnail_path,
    videoPost.video_path = req.body.video_path,
    videoPost.video_width = req.body.video_width,
    videoPost.video_duration = req.body.video_duration,
    videoPost.tags = req.body.tags,
    videoPost.power_up = req.body.power_up,
    videoPost.author = req.session.username,
    videoPost.posteddate = new Date();

    const videotags = [];

    videotags.push('NSFW');
    videotags.push('dpornclassic');
    videotags.push('dpornclassicvideo');

    var json_metadata = JSON.stringify({
      tags: videotags,
      video: {
          video_path: videoPost.video_path,
          thumbnail_path: videoPost.thumbnail_path,
          video_width: videoPost.video_width,
          video_duration: videoPost.video_duration,
          categories: videoPost.tags,
          power_up: videoPost.power_up,
      },
      app: 'steemporn.app'
    })

    var content  = `<p style="text-align:center">
    <a href="${SERVER}/video/${videoPost.permlink}/${videoPost.author}" target="_blank">
    <img src="${SERVER}/uploads/${videoPost.thumbnail_path}" style="margin: 0 auto" /></a></p>${videoPost.content}`;


    api.comment('', 'dpornclassic', videoPost.author, videoPost.permlink, videoPost.title, content, jsonMetadata, function (err, res) {
      if(err) {
        res.status(500);
      }
      videoPost.save(function(err){
        if(err){
          console.log(err);
          res.status(500);
          return;
        }
        //continue
        res.status(200).json({ result: 'success'});
      });
    });

  

  
});

// Access Control
function ensureAuthenticated(req, res, next){
  if(req.session.username){
    return next();
  } else {
    req.flash('danger', 'Please login');
    res.redirect('/login?state=upload');
  }
}

module.exports = router;