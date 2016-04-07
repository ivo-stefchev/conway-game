$("body").on("click", "button", function() {
    var id = $(this).attr('id');

    switch (id)
    {
        case 'button_create':
            window.location.href = "/create";
            break;
        case 'button_view_live':
            window.location.href = "/view/playing";
            break;
        case 'button_view_finished':
            window.location.href = "/view/finished";
            break;
    }
});
