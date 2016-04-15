var express = require('express');
var router = express.Router();
module.exports = router;

router.get('/', function(req, res, next) {
    req.session.redirect_after_successful_login = '/';
    req.logout();
    res.redirect('/');
});
