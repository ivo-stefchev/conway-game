var express = require('express');
var router = express.Router();
var url = require('url')
var mongo = require('../controller/mongo');
var gc = require('../controller/global_const');
module.exports = router;

router.get('/', function(req, res, next) {
    res.render('delete_list', {
        'title': 'Conway\'s Game of Life'
    });
});
