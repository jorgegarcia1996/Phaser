var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);

var players = {};

var star = {
  x: Math.floor(Math.random() * 700) + 50,
  y: Math.floor(Math.random() * 500) + 50
};

var scores = {
  blue: 0,
  red: 0
};

var playerNum = {
  redPlayers: 0,
  bluePlayers: 0
}

app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});


io.on('connection', function (socket) {
  console.log('a user connected:' + socket.id);

  players[socket.id] = {

    rotation: 0,
    x: Math.floor(Math.random() * 700) + 50,
    y: Math.floor(Math.random() * 500) + 50,
    playerId: socket.id,
    team: setTeam()
  };
  socket.emit('currentPlayers', players);
  socket.emit('starLocation', star);
  socket.emit('scoreUpdate', scores);
  socket.emit('playersUpdate', playerNum);
  socket.broadcast.emit('playersUpdate', playerNum);
  socket.broadcast.emit('newPlayer', players[socket.id])


  socket.on('disconnect', function () {
    console.log('user disconnected:' + socket.id);
    (players[socket.id].team === 'red') ? playerNum.redPlayers-- : playerNum.bluePlayers--;
    socket.broadcast.emit('playersUpdate', playerNum);
    delete players[socket.id];
    io.emit('disconnect', socket.id);

  });

  socket.on('playerMovement', function (movementData) {
    players[socket.id].x = movementData.x;
    players[socket.id].y = movementData.y;
    players[socket.id].rotation = movementData.rotation;
    socket.broadcast.emit('playerMoved', players[socket.id]);
  });

  socket.on('starCollected', function () {
    if (players[socket.id].team === 'red') {
      scores.red += 10;
    } else {
      scores.blue += 10;
    }
    star.x = Math.floor(Math.random() * 700) + 50;
    star.y = Math.floor(Math.random() * 500) + 50;
    io.emit('starLocation', star);
    io.emit('scoreUpdate', scores);
  });


});

server.listen(8082, function () {
  console.log(`Listening on ${server.address().port}`);
});

function setTeam() {
  if (playerNum.redPlayers === playerNum.bluePlayers) {
    if (Math.floor(Math.random() * 2) == 0) {
      playerNum.redPlayers++;
      return 'red';
    } else {
      playerNum.bluePlayers++;
      return 'blue';
    }
  } else {
    if (playerNum.redPlayers < playerNum.bluePlayers) {
      playerNum.redPlayers++;
      return 'red';
    } else {
      playerNum.bluePlayers++;
      return 'blue';
    }
  }
}