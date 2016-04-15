var mongodb = require('mongodb');
var gc = require('./global_const');
var MongoClient;
var DB;
var url = 'mongodb://127.0.0.1:27017/conway';
if (!gc.LOCALHOST)
{
    url = 'mongodb://95.87.226.163:27017/conway';
}
var collection = {};
collection.games = 'games';
collection.status = 'status';
collection.users = 'users';
var status = {};
status.start = 'start';
status.playing = 'playing';
status.finish = 'finish';
status.replaying = 'replaying';

module.exports.init = init;
module.exports.close = close;
module.exports.save_game = save_game;
module.exports.save_game_generation = save_game_generation;
module.exports.get_initial_game = get_initial_game;
module.exports.get_currently_played_games = get_currently_played_games;
module.exports.get_finished_games = get_finished_games;
module.exports.set_as_playing = set_as_playing;
module.exports.set_as_finished = set_as_finished;
module.exports.set_as_replaying = set_as_replaying;
module.exports.get_game_status = get_game_status;
module.exports.get_game_generation = get_game_generation;
module.exports.delete_game = delete_game;
module.exports.add_user = add_user;
module.exports.find_user_by_username = find_user_by_username;
module.exports.find_user_by_id = find_user_by_id;

function find_user_by_id(user_id, callback)
{
    var id_object = new mongodb.ObjectID(user_id);
    var users_coll = DB.collection(collection.users);
    users_coll.findOne({ '_id': id_object },
        function (err, result) {
            if (result === null)
            {
                callback(false);
            }
            else
            {
                callback(result);
            }
        });
}

function find_user_by_username(username, callback)
{
    var users_coll = DB.collection(collection.users);
    users_coll.findOne({ 'name': username },
        function (err, result) {
            if (result === null)
            {
                callback(false);
            }
            else
            {
                callback(result);
            }
        });
}

function add_user(username, password, callback)
{
    var user_obj = {
        'name': username,
        'pass': password
    };

    var users_coll = DB.collection(collection.users);
    users_coll.insert(user_obj, function (err, result) {
        if (err)
        {
            console.log(err);
        }
        else
        {
            var user_id = result.insertedIds[0];
            callback(user_id);
        }
    });
}

function delete_game(id, callback)
{
    var status_coll = DB.collection(collection.status);
    status_coll.remove({ 'game_id': id }, function (err, result) {
        var games_coll = DB.collection(collection.games);
        games_coll.remove({ 'game_id': id },
            function (err, result) {
                callback();
        });
    });
}

function get_game_generation(id, generation, callback)
{
    var games_coll = DB.collection(collection.games);
    games_coll.findOne({ 'game_id': id, 'generation': generation },
        function (err, result) {

            if (result === null)
            {
                callback(id, null, true);
            }
            else
            {
                callback(id, result.board, false);
            }
        });
}

function get_game_status(id, callback)
{
    var status_coll = DB.collection(collection.status);
    status_coll.findOne({ 'game_id': id }, function (err, result) {
        callback(id, result.status, result.name);
    });
}

function get_currently_played_games(callback)
{
    var status_coll = DB.collection(collection.status);
    var query_res = status_coll.find({ 'status': status.playing });
    var result = [];
    query_res.each(function(err, doc) {
        if (doc != null) {
            result.push(doc);
        } else {
            callback(result);
        }
    });
}

function get_finished_games(callback)
{
    var status_coll = DB.collection(collection.status);
    var query_res = status_coll.find({ 'status': status.finish });
    var result = [];
    query_res.each(function(err, doc) {
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

function set_as_replaying(id)
{
    var status_coll = DB.collection(collection.status);
    status_coll.updateOne({ 'game_id': id },
        { $set: { 'status': status.replaying }},
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

function save_game_generation(id, board, generation)
{
    var game_obj = {
        'game_id': id,
        'board': board,
        'generation': generation
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
