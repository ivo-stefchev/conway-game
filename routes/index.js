var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    req.session.redirect_after_successful_login = '/';
    res.render('index', { title: 'Conway\'s Game of Life' });
});

module.exports = router;
