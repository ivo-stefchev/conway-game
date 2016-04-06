var express = require('express');
var url = require('url')
var router = express.Router();

var gc = require('../controller/global_const');
var play = require('../controller/play');

router.post('/', function(req, res, next) {
    //var url_parts = url.parse(req.url, true);
    var data = req.body;

    res.json({
        'title': 'Conway\'s Game of Life',
        'board': play.get_game(data.game_id),
        'game_id': data.game_id,
        'rows': gc.ROWS,
        'cols': gc.COLS,
        'cell': gc.CELL_SIZE,
        'timeout': gc.TIMEOUT
    });

    play.start_game(data.game_id);
});

module.exports = router;
