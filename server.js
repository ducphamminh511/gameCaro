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
    console.log('Dang chay o cong 5k :)');
});

io.on('connection', function(socket){
    socket.on('clientClick',function(data){
        console.log(data);
        socket.broadcast.emit('serverNotify', data);
    });
    socket.on('chonmau', function(d){
        if(d.color == 'black')
        {
            socket.broadcast.emit('confirmColor', {color:'black'});
        }
        if(d.color == 'white')
        {
            socket.broadcast.emit('confirmColor', {color:'white'});
        }
    })
});

