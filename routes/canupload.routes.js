const express = require('express');
const router = express.Router();
const moment = require("moment");
const CanUpload = require('../models/canupload.model');

router.get('/canupload', ensureAuthenticated, (req, res) => {
  getUsersWhoCanUpload()
  .then(users => {
    res.render('canupload', {
      users
    })
  });
});

router.delete('/canupload/:id', ensureAuthenticated, (req, res) => {
  CanUpload.remove({"_id": req.params.id }, (err) => {
    if(err) {
      console.log(err)
    } else {
      res.status(200).send({ result: req.params.id});
    }
  })
  
});

router.post('/canupload', ensureAuthenticated, (req, res) => {
  user = new CanUpload();
  user.username = req.body.username;
  user.save(err => {
    if (err) {
      res.send(err)
    } else {
      res.redirect('/admin/canupload');
    }
  })
})

const getUsersWhoCanUpload = () => {
  const promise = new Promise(function (resolve, reject) {

    CanUpload.find({}).sort({
      "username": 1
    }).exec(function (err, usersWhoCanUpload) {
      if (err) {
        resolve([]);
      } else {
        resolve(usersWhoCanUpload);
      }
    });
  });
  return promise;
};

function ensureAuthenticated(req, res, next) {
  let masterUsers = ['sudguru', 'pranishg', 'dpornshop']
  let username = req.session.username;
  let expirationTimestamp = req.session.expirationTimestamp
  let currentTimestamp = moment(new Date()).format('X');
  let validUser = (expirationTimestamp > currentTimestamp) ? true : false;
  console.log(validUser)
  console.log(username)
  if (username && validUser) {
    if (masterUsers.indexOf(username) >= 0) {
      return next();
    } else {
      res.status(200).send(`<h2> ! Not Authorized.`);
    }
  } else {
    redirectPath = 'admin' + req.path;
    res.redirect('/auth/login?state=' + redirectPath);
  }
}
module.exports = router;