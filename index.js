var express = require('express');
var app = express();
//Load 

//Chạy server
var server = require('http').createServer(app);
//socket
var io = require('socket.io')(server);
app.set('port', process.env.PORT || 5000);

app.use(express.static(__dirname +'/public'));
app.get('/', function(req,res){
    res.sendFile(__dirname +'/caro.html');
})

server.listen(app.get('port'),function(){
    console.log('Server is running on port : ' + app.get('port'));
});

// Tạo đối tượng người chơi
function player(name, turn) {
    this.name = name;
    this.id = "1";
    this.turn = turn || null;
};

// Mãng người chơi
var Players = [];

io.on('connection', function (socket) {
    socket.broadcast.emit('listPlayers', Players);
    socket.on('clientClick', function (data) {
        console.log(data);
        socket.broadcast.emit('serverNotify', data);
    });
    socket.on('joinUser', function (data) {
        // console.log(data);
        // Khởi tạo đối tượng
        var user = new player(data.username); 
        Players.push(user);
        //console.log(Players);
        socket.broadcast.emit('listPlayers', Players);
    });
    socket.on('refresh', function (data) {
        socket.emit('listPlayers', Players);
    });
    socket.on('sendMessage', function (data) {
        //console.log(data);
        socket.broadcast.emit('serverSendMsg', data);
    });
    socket.on('chonmau', function (d) {
        if (d.color == 'black') {
            socket.broadcast.emit('confirmColor', d);
        }
        if (d.color == 'white') {
            socket.broadcast.emit('confirmColor', d);
        }
    });
    socket.on('disconnect', function (data) {
        Players.splice(Players.indexOf(data), 1);
    });
});

