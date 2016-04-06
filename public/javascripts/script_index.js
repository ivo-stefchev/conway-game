$("body").on("click", "button", function() {
    var id = $(this).attr('id');

    switch (id)
    {
        case 'button_create':
            window.location.href = "/create";
            break;
        case 'button_view':
            window.location.href = "/view";
            break;
    }
});
