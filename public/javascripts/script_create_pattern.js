var canvas = $("#canvas");
var name_element = $("#pattern_name");
var gen_element = $("#pattern_generation");

var game = new Game(canvas, name_element, gen_element, rows, cols, cell, timeout, game_id, start_game);

function Game(canvas, name_div, gen_div, ro, co, cell_size, to, id, start)
{
    this.canvas = canvas;
    this.name_div = name_div;
    this.gen_div = gen_div;
    this.ctx = canvas.get(0).getContext("2d");
    this.rows = ro;
    this.cols = co;
    this.cell = cell_size;
    this.timeout = to;
    this.game_id = id;
    this.start_game = start_game;

    var __this = this;

    this.init = function()
    {
        this.w = this.cols * this.cell;
        this.h = this.rows * this.cell;
        this.canvas.attr("width", this.w + "px");
        this.canvas.attr("height", this.h + "px");

        //var socket = io.connect('http://localhost:3000/');
        var socket = io.connect('http://' + window.document.location.host + '/');
        if (!localhost)
        {
            socket = io.connect('https://' + window.document.location.host + '/');
        }
        socket.on('connect', function(data) {
            /*
            if (__this.start_game)
            {
                socket.emit('start', id);
            }
            */
            socket.emit('start', id);
        });
        socket.on('game_' + id, function(data) {
            __this.name_div.text(data.name);
            __this.gen_div.text(data.generation);
            __this.on_register_success(data);
        });
        socket.on('game_over_' + id, function(id) {
            var generation = __this.gen_div.text();
            __this.gen_div.text('Game finished (' + generation + ')');
            socket.removeListener('game_' + id, function() {});
        });

        /*
        $.post({
            url: '/register_for_game',
            data: {'game_id': this.game_id},
            //success: __this.on_register_success,
            success: function(data, text_status) {
                __this.on_register_success(data, text_status);
            },
            dataType: 'json'
        });
        */

        //var socket = new WebSocket("ws://localhost:3000/ws/echo/");
        //var socket = new WebSocket('ws://' + window.document.location.host + '/ws/echo/', ["protocolOne", "protocolTwo"]);
    };

    this.init();
}

Game.prototype.on_register_success = function(data, text_status)
{
    this.draw(data.board);
}

Game.prototype.draw = function(board)
{
    this.ctx.strokeStyle = "gray";

    this.ctx.clearRect(0, 0, this.w, this.h);
    this.ctx.beginPath();
    for (var i = 1; i < this.rows; i++)
    {
        this.ctx.moveTo(0, this.cell * i);
        this.ctx.lineTo(this.w, this.cell * i);
    }
    for (var i = 1; i < this.cols; i++)
    {
        this.ctx.moveTo(this.cell * i, 0);
        this.ctx.lineTo(this.cell * i, this.h);
    }

    this.ctx.stroke();

    this.ctx.beginPath();
    for (var i = 0; i < this.rows; i++)
    {
        for (var ii = 0; ii < this.cols; ii++)
        {
            if (board[i][ii])
            {
                this.ctx.rect(this.cell * ii, this.cell * i, this.cell, this.cell);
                this.ctx.fillRect(this.cell * ii, this.cell * i, this.cell, this.cell);
            }
        }
    }

    this.ctx.stroke();
}
