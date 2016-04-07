var express = require('express');
var router = express.Router();
var url = require('url')
var mongo = require('../controller/mongo');
var gc = require('../controller/global_const');

router.get('/playing/', function(req, res, next) {
    res.render('view', {
        'title': 'Conway\'s Game of Life',
        'live': true
    });
});

router.get('/finished/', function(req, res, next) {
    res.render('view', {
        'title': 'Conway\'s Game of Life',
        'live': false
    });
});

router.get('/get_currently_played_games', function(req, res, next) {
    function callback(games)
    {
        res.json(games);
    }
    mongo.get_currently_played_games(callback);
});

router.get('/get_finished_games', function(req, res, next) {
    function callback(games)
    {
        res.json(games);
    }
    mongo.get_finished_games(callback);
});

router.get('/game/*', function(req, res, next) {
    var url_parts = url.parse(req.url, true);
    var path = url_parts.pathname;
    var re = /^\/game\/([0-9a-f]*)/g
    var exec = re.exec(path);
    var game_id = exec[1];

    res.render('create_pattern', {
        'title': 'Conway\'s Game of Life',
        'game_id': game_id,
        'start_game': false,
        'rows': gc.ROWS,
        'cols': gc.COLS,
        'cell': gc.CELL_SIZE,
        'timeout': gc.TIMEOUT
    });
});

module.exports = router;
