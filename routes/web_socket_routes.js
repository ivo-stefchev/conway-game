var socket_io = require('socket.io');
var io;
var start_game_callback;

module.exports.io = io;
module.exports.init = init;
module.exports.register_play = register_play;
module.exports.emit_board = emit_board;
module.exports.game_over = game_over;

function init(server)
{
    io = socket_io(server);

    io.on('connection', function(socket) {

        socket.on('start', function(id) {
            start_game_callback(id);
        });

    });
}

function register_play(callback)
{
    start_game_callback = callback;
}

function emit_board(game)
{
    io.sockets.emit('game_' + game.game_id, game);
}

function game_over(id)
{
    io.sockets.emit('game_over_' + id, id);
}


/*
var express = require('express');
var router = express.Router();

router.ws('/echo', function(ws, req) {
    console.log('my first web socket');
    ws.on('message', function(msg) {
        ws.send(msg);
    });
});

router.ws('/echo', function(req, res, next) {
    res.render('create', {
        'title': 'Conway\'s Game of Life',
        'pattern_dim_min': 5,
        'pattern_dim_max': 30,
        'pattern_dim_default': 10
    });
});

module.exports = router;
*/
