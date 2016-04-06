var mongodb = require('mongodb');
var MongoClient;
var DB;
var url = 'mongodb://localhost:27017/conway';
var collection = {};
collection.games = 'games';
collection.status = 'status';
var status = {};
status.start = 'start';
status.playing = 'playing';
status.finish = 'finish';

module.exports.init = init;
module.exports.close = close;
module.exports.save_game = save_game;
module.exports.get_initial_game = get_initial_game;
module.exports.start_game = start_game;
module.exports.get_currently_played_games = get_currently_played_games;
module.exports.set_as_playing = set_as_playing;
module.exports.set_as_finished = set_as_finished;

function start_game(id)
{
}

function get_currently_played_games(callback)
{
    var status_coll = DB.collection(collection.status);
    var fuck = status_coll.find({ 'status': status.playing });
    var result = [];
    fuck.each(function(err, doc) {
        if (doc != null) {
            result.push(doc);
        } else {
            callback(result);
        }
    });
}

function set_as_playing(id)
{
    var status_coll = DB.collection(collection.status);
    status_coll.updateOne({ 'game_id': id },
        { $set: { 'status': status.playing }},
        function(err, results) {});
}

function set_as_finished(id)
{
    var status_coll = DB.collection(collection.status);
    status_coll.updateOne({ 'game_id': id },
        { $set: { 'status': status.finish }},
        function(err, results) {});
}

function get_initial_game(id, callback)
{
    var game = { 'game_id': id, 'generation': 1 };

    var status_coll = DB.collection(collection.status);
    status_coll.findOne({ 'game_id': id }, function (err, result) {
        game.name = result.name;

        var games_coll = DB.collection(collection.games);
        games_coll.findOne({ 'game_id': id, 'generation': 1 },
            function (err, result) {
                game.board = result.board;
                callback(game);
        });
    });
}

function save_game(id, board, name)
{
    var status_obj = {
        'name': name,
        'game_id': id,
        'status': status.start
    };
    var status_coll = DB.collection(collection.status);
    status_coll.insert(status_obj, function (err, result) {
        if (err) { console.log(err); }
    });

    var game_obj = {
        'game_id': id,
        'board': board,
        'generation': 1
    };

    var games_coll = DB.collection(collection.games);
    games_coll.insert(game_obj, function (err, result) {
        if (err) { console.log(err); }
    });
}


function init()
{
    if (MongoClient === undefined)
    {
        MongoClient = mongodb.MongoClient;
        // Use connect method to connect to the Server
        MongoClient.connect(url, function (err, db) {
            if (err)
            {
                console.log('Unable to connect to the mongoDB server.' +
                    'Error:', err);
            } else {
                console.log('Connection established to', url);
                // do some work here with the database.
                if (db.status) db.status.drop();
                if (db.games) db.games.drop();
                DB = db;
            }
        });
    }
    else
    {
        console.error('Error! MongoDB already init');
    }
}

function close()
{
    if (DB) DB.close();
}
