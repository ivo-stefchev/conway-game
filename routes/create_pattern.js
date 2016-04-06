var express = require('express');
var url = require('url')
var router = express.Router();

var controller_game = require('../controller/matrix');
var gc = require('../controller/global_const');
var play = require('../controller/play');

router.get('/', function(req, res, next) {
    var url_parts = url.parse(req.url, true);
    var pattern = url_parts.query;
    //req.app.locals.register_new_game(query);

    var game_id = controller_game.construct(
        pattern.create_pattern_height,
        pattern.create_pattern_width,
        pattern.create_pattern,
        pattern.create_pattern_name
    );

    res.render('create_pattern', {
        'title': 'Conway\'s Game of Life',
        'game_id': game_id,
        'start_game': true,
        'rows': gc.ROWS,
        'cols': gc.COLS,
        'cell': gc.CELL_SIZE,
        'timeout': gc.TIMEOUT
    });
});

module.exports = router;
