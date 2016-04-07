if (live_games)
{
    $.get({
        url: '/view/get_currently_played_games',
        success: function(data, text_status) {
            populate_games_list(data);
        },
        dataType: 'json'
    });
}
else
{
    $.get({
        url: '/view/get_finished_games',
        success: function(data, text_status) {
            populate_games_list(data);
        },
        dataType: 'json'
    });
}

function populate_games_list(games)
{
    var list_of_games_to_choose =
        $('#list_of_games_to_choose');
    var ol;
    if (games.length === 0)
    {
        var txt = (live_games) ?
            'No games currently in play.' :
            'No completed games.';
        list_of_games_to_choose.text(txt);
    } else {
        ol = $('<ol>');
        list_of_games_to_choose.append(ol);
    }


    for (var i = 0; i < games.length; i++)
    {
        ol.append('<li>' + games[i].name + '&nbsp;' +
            '<span class="click_to_watch_game" ' +
            'data-id="' + games[i].game_id + '">view game</span></li>')
    }
}

$("#list_of_games_to_choose").
    on("click", "span.click_to_watch_game", function() {
        var game_id = $(this).data('id');
        var url = '';
        if (live_games) url = '/view/game/';
        else url = '/view/game_saved/';
        window.location.href = url + game_id;
    });
