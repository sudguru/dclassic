const multer = require('multer');
const path = require('path');
const generalData = require('../config/generalData');
// Video Model
let Video = require('../models/video.model');


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


_this = this




exports.showUploadForm = function(req, res, next){
  res.render('upload', { categoryList: generalData.categoryList });
}

exports.uploadVideo = function(req, res, next) {
  upload(req, res, (err) => {
    if(err){
      res.status(500).send('Some Error Occured at Server');
    } else {
      res.send(req.session.filename);    
    }
  });
}

exports.savePost = async function(req, res, next) {
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

  var jsonMetadata = {
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
  }

  var content  = `<p style="text-align:center">
  <a href="${generalData.SERVER_NAME}/video/${videoPost.permlink}/${videoPost.author}" target="_blank">
  <img src="${generalData.SERVER_NAME}/uploads/${videoPost.thumbnail_path}" style="margin: 0 auto" /></a></p>${videoPost.content}`;


  req.app.locals.SCapi.comment('', 'dpornclassic', videoPost.author, videoPost.permlink, videoPost.title, content, jsonMetadata, function (err, result) {
    if(err) {
      console.log(err);
      res.status(500).json({ error: 'steem error'});
      res.end();
    } else {
      videoPost.save(function(err){
        if(err){
          console.log(err);
          res.status(500).json({ error: 'mongo error'});
          return;
        }
        //continue
        res.status(200).json({ result: 'success'});
      });
    }
  });

}


// exports.showUploadForm = async function(req, res, next){

//   try{
//       var videos = await Video.find({}).limit(10).sort( { posteddat: -1 });
//       return res.status(200).json({ data: videos, error: null });
//   }catch(e){
//       return res.status(400).json({ data: [], error: e.message});
//   }
// }