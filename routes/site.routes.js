const express = require('express');
const router = express.Router();

var SiteController = require('../controllers/site.controller');



router.get('/', SiteController.showHomePage);
router.get('/video/:category', SiteController.showCategoryPage);
router.get('/profile/:author', SiteController.showProfilePage);
router.get('/video/:permlink/:author', SiteController.showVideoPage);
router.get('/hot', SiteController.listHotVideos);
router.get('/trending', SiteController.listTrendingVideos);
router.get('/new', SiteController.listNewVideos);


module.exports = router;


