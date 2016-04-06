var crypto = require('crypto');
var gc = require('./global_const');
var play = require('./play');

module.exports.construct = construct_starting_pattern;
module.exports.recalc_cells = recalc_cells;

function construct_starting_pattern(hei, wid, pattern_arr, name)
{
    var rows = Number(hei);
    var cols = Number(wid);
    var alive_cells = [];
    if (pattern_arr.length > 0)
    {
        pattern_arr.split(',').forEach(function(el, index, array) {
            alive_cells.push(Number(el));
        });
    }

    var pattern = [];
    for (var i = 0; i < rows; i++)
    {
        pattern[i] = [];
        for (var ii = 0; ii < cols; ii++)
        {
            pattern[i][ii] = false;
            if (alive_cells.some(function(el){ return el === i * cols + ii }))
            {
                pattern[i][ii] = true;
            }
        }
    }

    /*
    var str = '';
    for (var i = 0; i < rows; i++)
    {
        for (var ii = 0; ii < cols; ii++)
        {
            str += (pattern[i][ii]) ? 1 : 0;
        }
        str += '\n';
    }
    console.log(str);
    */

    var id = crypto.randomBytes(16).toString('hex');

    start_game(rows, cols, pattern, id, name);

    return id;
}

function start_game(pattern_rows, pattern_cols, pattern, id, name)
{
    var rows = gc.ROWS;
    var cols = gc.COLS;
    var timeout = gc.TIMEOUT;
    var board = init_board(pattern_rows, pattern_cols, pattern, rows, cols);
    play.set_game(id, board, name);

    /*
    var str = '';
    for (var i = 0; i < rows; i++)
    {
        for (var ii = 0; ii < cols; ii++)
        {
            str += (board[i][ii]) ? 1 : 0;
        }
        str += '\n';
    }
    console.log(str);
    */
}

function recalc_cells(board)
{
    var new_generation = [];
    for (var i = 0; i < gc.ROWS; i++)
    {
        new_generation[i] = [];
        for (var ii = 0; ii < gc.COLS; ii++)
        {
            var neighbors = 0;
            if (i > 0)
            {
                if (ii > 0)
                {
                    if (board[i - 1][ii - 1]) neighbors++;
                }
                if (board[i - 1][ii]) neighbors++;
                if (ii < gc.COLS - 1)
                {
                    if (board[i - 1][ii + 1]) neighbors++;
                }
            }
            if (ii > 0)
            {
                if (board[i][ii - 1]) neighbors++;
            }
            if (ii < gc.COLS - 1)
            {
                if (board[i][ii + 1]) neighbors++;
            }
            if (i < gc.ROWS - 1)
            {
                if (ii > 0)
                {
                    if (board[i + 1][ii - 1]) neighbors++;
                }
                if (board[i + 1][ii]) neighbors++;
                if (ii < gc.COLS - 1)
                {
                    if (board[i + 1][ii + 1]) neighbors++;
                }
            }

            if (neighbors == 3)
            {
                new_generation[i][ii] = true;
            }
            else if (neighbors == 2 && board[i][ii])
            {
                new_generation[i][ii] = true;
            }
            else
            {
                new_generation[i][ii] = false;
            }
        }
    }
    //board = new_generation;
    return new_generation;
}

function init_board(pattern_rows, pattern_cols, pattern, rows, cols)
{
    var start_col = Math.floor(cols / 2) - Math.floor(pattern_cols / 2);
    var end_col = start_col + pattern_cols - 1;
    var start_row = Math.floor(rows / 2) - Math.floor(pattern_rows / 2);
    var end_row = start_row + pattern_rows - 1;
    var board = [];
    for (var i = 0; i < rows; i++)
    {
        board[i] = [];
        for (var ii = 0; ii < cols; ii++)
        {
            var cell_alive = false;
            if (ii >= start_col && 
                ii <= end_col &&
                i >= start_row &&
                i <= end_row)
            {
                var pattern_current_row = i - start_row;
                var pattern_current_col = ii - start_col;
                cell_alive = pattern[pattern_current_row][pattern_current_col];
            }
            board[i][ii] = cell_alive;
        }
    }

    return board;
}
