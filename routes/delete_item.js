var express = require('express');
var router = express.Router();
var url = require('url')
var mongo = require('../controller/mongo');
var gc = require('../controller/global_const');
module.exports = router;

router.get('/*', function(req, res, next) {
    var url_parts = url.parse(req.url, true);
    var path = url_parts.pathname;
    var re = /^\/([0-9a-f]*)/g
    var exec = re.exec(path);
    var game_id = exec[1];

    function delete_respond()
    {
        res.json({'delete_id': game_id});
    }
    mongo.delete_game(game_id, delete_respond);
});
