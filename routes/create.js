var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('create', {
        'title': 'Conway\'s Game of Life',
        'pattern_dim_min': 5,
        'pattern_dim_max': 30,
        'pattern_dim_default': 10
    });
});

module.exports = router;
