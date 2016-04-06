var pattern_width = 0;
var pattern_height = 0;
var create_pattern_container = $("#create_pattern_container");
var create_pattern_container_width = $("#create_pattern_width");
var create_pattern_container_height = $("#create_pattern_height");
var redraw_create_grid_timeout_id;

create_pattern_container_width.on('input', redraw_create_grid_pre);
create_pattern_container_height.on('input', redraw_create_grid_pre);

redraw_create_grid();

$("svg#create_pattern_container").on("click", "rect.pattern_cell", function() {
    $(this).toggleClass('pattern_cell_selected');
});

$("#create_pattern_form").submit(function(event) {
    var selected_cells = [];
    var cells = $("rect.pattern_cell");
    for (var i = 0; i < pattern_height; i++)
    {
        for (var ii = 0; ii < pattern_width; ii++)
        {
            var index = ii + (i * pattern_width);
            if (cells.eq(index).hasClass('pattern_cell_selected'))
            {
                selected_cells.push(ii + (i * pattern_width));
            }
        }
    }
    $("#create_pattern_hidden").val(selected_cells.join(","));
});

function redraw_create_grid_pre()
{
    clearTimeout(redraw_create_grid_timeout_id);
    redraw_create_grid_timeout_id = setTimeout(redraw_create_grid, 750);
}

function redraw_create_grid()
{
    check_min_max();

    var arr = [];
    var cells = $("rect.pattern_cell");
    for (var i = 0; i < pattern_height; i++)
    {
        arr[i] = [];
        for (var ii = 0; ii < pattern_width; ii++)
        {
            arr[i][ii] = cells.eq(ii + (i * pattern_width)).hasClass('pattern_cell_selected');
        }
    }

    var new_width = parseInt(create_pattern_container_width.val());
    var new_height = parseInt(create_pattern_container_height.val());

    create_pattern_container.attr('width', new_width * 10);
    create_pattern_container.attr('height', new_height * 10);
    create_pattern_container.empty();

    for (var i = 0; i < new_height; i++)
    {
        for (var ii = 0; ii < new_width; ii++)
        {
            var cls = '';
            if (i < pattern_height &&
                ii < pattern_width &&
                arr[i][ii])
            {
                cls = ' pattern_cell_selected';
            }
            var new_cell = $(document.createElementNS("http://www.w3.org/2000/svg", "rect")).attr({
                'x': ii * 10,
                'y': i * 10,
                'width': 10,
                'height': 10,
                'stroke': "red",
                'fill': "white",
                'class': "pattern_cell" + cls
            });
            create_pattern_container.append(new_cell);
        }
    }

    pattern_width = new_width;
    pattern_height = new_height;
}

function check_min_max()
{
    var new_width = parseInt(create_pattern_container_width.val());
    if (isNaN(new_width) || (new_width < pattern_dim_min))
    {
        new_width = pattern_dim_min;
        create_pattern_container_width.val(pattern_dim_min)
    }
    else if (new_width > pattern_dim_max)
    {
        new_width = pattern_dim_max;
        create_pattern_container_width.val(pattern_dim_max)
    }

    var new_height = parseInt(create_pattern_container_height.val());
    if (isNaN(new_height) || (new_height < pattern_dim_min))
    {
        new_height = pattern_dim_min;
        create_pattern_container_height.val(pattern_dim_min)
    }
    else if (new_height > pattern_dim_max)
    {
        new_height = pattern_dim_max;
        create_pattern_container_height.val(pattern_dim_max)
    }
}
