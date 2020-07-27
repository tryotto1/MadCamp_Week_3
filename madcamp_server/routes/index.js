var express = require('express');
const router = express.Router();

// routes로 넘어가도록 한다
var login_signin = require('./login_signin');
var videos = require('./video');
var ranks = require('./ranks');

// 스키마를 적용해서, 새로운 통신을 열어준다
router.use('/login_signin', login_signin);
router.use('/videos', videos);
router.use('/ranks', ranks);


/* GET home page. */
router.get('/', function(req, res, next) {  
  res.render('index', { title: 'Express' });
});

module.exports = router;
