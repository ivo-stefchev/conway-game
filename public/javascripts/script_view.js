$.get({
    url: '/view/get_currently_played_games',
    success: function(data, text_status) {
        get_currently_played_games(data);
    },
    dataType: 'json'
});

function get_currently_played_games(games)
{
    var list_of_currently_played_games =
        $('#list_of_currently_played_games');
    if (games.length === 0)
    {
        list_of_currently_played_games.text('' +
            'No games currently in play.');
    }

    for (var i = 0; i < games.length; i++)
    {
        list_of_currently_played_games.append('' +
            '<div>' + games[i].name + '&nbsp;' +
            '<span class="click_to_watch_game_live" ' +
            'data-id="' + games[i].game_id + '">view live</span></div>')
    }
}

$("#list_of_currently_played_games").
    on("click", "span.click_to_watch_game_live", function() {
        var game_id = $(this).data('id');
        window.location.href = "/view/game/" + game_id;
    });
