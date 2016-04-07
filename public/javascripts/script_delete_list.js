$.get({
    url: '/view/get_finished_games',
    success: function(data, text_status) {
        populate_games_list(data);
    },
    dataType: 'json'
});

function populate_games_list(games)
{
    var list_of_games_to_choose =
        $('#list_of_games_to_choose_delete');
    var ol;
    if (games.length === 0)
    {
        var txt = 'No games to delete.';
        list_of_games_to_choose.text(txt);
    } else {
        ol = $('<ol>');
        list_of_games_to_choose.append(ol);
    }

    for (var i = 0; i < games.length; i++)
    {
        ol.append('<li>' + games[i].name + '&nbsp;' +
            '<span class="click_to_watch_game" ' +
            'data-id="' + games[i].game_id + '">delete game</span></li>')
    }
}

$("#list_of_games_to_choose_delete").
    on("click", "span.click_to_watch_game", function() {
        var game_id = $(this).data('id');
        var el = this;
        $.get({
            url: '/delete_item/' + game_id,
            success: function(data, text_status) {
                $(el).parent().empty();
            },
            dataType: 'json'
        });
    });
