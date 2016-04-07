var gc = require('./global_const');
var web_socket_routes = require('../routes/web_socket_routes');
var controller_matrix = require('../controller/matrix');
var games = {};
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
    mongo.get_game_status(id, start_game_middle);
}

function start_game_middle(game_id, game_status, game_name)
{
    if (game_status === 'finish')
    {
        replay_game(game_id);
    }
    else if (game_status === 'start')
    {
        mongo.get_initial_game(game_id, start_game_callback);
    }
    else if (game_status === 'replaying')
    {
        // nothing to do, except subscribe on the client side
    }
    else
    {
        // game is currently 'playing'
        // nothing to do, except subscribe on the client side
    }
}

function replay_game(game_id, game_name)
{
    games[game_id] = {
        'name': game_name,
        'game_id': game_id,
        'generation': 0
    };
    mongo.set_as_replaying(game_id);
    games_started[game_id] = setInterval(function() {
        games[game_id].generation++;
        mongo.get_game_generation(
            game_id,
            games[game_id].generation,
            replay_next_generation
        );
    }, gc.TIMEOUT);
}

function replay_next_generation(id, board, stop_replay)
{
    if (stop_replay)
    {
        mongo.set_as_finished(id);
        clearInterval(games_started[id]);
        delete games[id];
        delete games_started[id];
        web_socket_routes.game_over(id);
    }
    else
    {
        games[id].board = board;
        web_socket_routes.emit_board(games[id]);
    }
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
