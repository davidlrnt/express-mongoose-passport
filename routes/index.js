var express = require('express');
var router  = express.Router();
var auth    = require('../helpers/auth');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Awesome App' });
});

router.get('/profile', auth.checkLoggedIn('You have to login to access this content', '/login'), function(req, res, next) {
  res.render('profile', { user: req.user });
});

router.get('/power', auth.checkLoggedIn('You have to login to access this content', '/login'), auth.checkCredentials('power'), function(req, res, next) {
  res.render('admin', { user: JSON.stringify(req.user) });
});

module.exports = router;
