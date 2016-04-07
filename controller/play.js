var gc = require('./global_const');
var web_socket_routes = require('../routes/web_socket_routes');
var controller_matrix = require('../controller/matrix');
var games = {};
var generation = {};
var games_started = {};
var mongo = require('./mongo');

module.exports.set_game = set_game;
module.exports.start_game = start_game;

web_socket_routes.register_play(start_game);

function set_game(id, board, name)
{
    // save game to db here
    mongo.save_game(id, board, name);
}

function start_game(id)
{
    mongo.get_initial_game(id, start_game_callback);
}

function start_game_callback(game)
{
    var id = game.game_id;
    mongo.set_as_playing(id);
    games[id] = game;
    next_generation(id);
    games_started[id] = setInterval(function() {
        next_generation(id)
    }, gc.TIMEOUT);
}

function next_generation(id)
{
    //web_socket_routes.emit_board(id, games[id][0]);
    web_socket_routes.emit_board(games[id]);
    games[id].board = controller_matrix.recalc_cells(games[id].board);
    games[id].generation++;

    if (games[id].generation > gc.GENERATION_LIMIT)
    {
        // game stops here
        mongo.set_as_finished(id);
        clearInterval(games_started[id]);
        delete games[id];
        delete games_started[id];
        web_socket_routes.game_over(id);
    }
    else
    {
        mongo.save_game_generation(id,
                games[id].board, games[id].generation);
    }
}
