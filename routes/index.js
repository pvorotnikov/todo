/**
 * @description: Main application router.
 * @author: Petar Vorotnikov
 * @email: petar@vorotnikov.net
 */

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'My TODOs' });
});

module.exports = router;
