var config = {
  type: Phaser.AUTO,
  parent: "phaser-example",
  width: 800,
  height: 600,
  physics: {
    default: "arcade",
    arcade: {
      debug: false,
      gravity: { y: 0 }
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

var game = new Phaser.Game(config);

function preload() {
  this.load.image("ship1", "assets/ship1.png");
  this.load.image("ship2", "assets/ship2.png");
  this.load.image("ship3", "assets/ship3.png");
  this.load.image("ship4", "assets/ship4.png");
  this.load.image("background", "assets/background.png");
  this.load.image("options", "assets/options.png");
  this.load.image("otherPlayer", "assets/otherPlayer.png");
  this.load.image("star", "assets/star_gold.png");
}

function create() {
  var self = this;
  this.socket = io();
  this.otherPlayers = this.physics.add.group();

  this.background = this.add.tileSprite(
    0,
    0,
    config.width,
    config.height,
    "background"
  );
  this.background.setOrigin(0, 0);

  //Options and Select Ship
  shipsMenuToggle = false;
  this.options = this.add.image(20, 90, "options");
  this.options
    .setOrigin(0, 0)
    .setDisplaySize(50, 50)
    .setInteractive();

  this.shipsText = this.add.text(10, 160, "Ships", {
    fontSize: "24px",
    fill: "#FFFFFF"
  });

  this.ship1 = this.add.image(20, 200, "ship1");
  this.ship1
    .setOrigin(0, 0)
    .setDisplaySize(50, 50)
    .setInteractive();

  this.ship2 = this.add.image(20, 270, "ship2");
  this.ship2
    .setOrigin(0, 0)
    .setDisplaySize(50, 50)
    .setInteractive();

  this.ship3 = this.add.image(20, 340, "ship3");
  this.ship3
    .setOrigin(0, 0)
    .setDisplaySize(50, 50)
    .setInteractive();

  this.ship4 = this.add.image(20, 410, "ship4");
  this.ship4
    .setOrigin(0, 0)
    .setDisplaySize(50, 50)
    .setInteractive();

  this.shipsText.visible = shipsMenuToggle;
  this.ship1.visible = shipsMenuToggle;
  this.ship2.visible = shipsMenuToggle;
  this.ship3.visible = shipsMenuToggle;
  this.ship4.visible = shipsMenuToggle;

  this.input.on("gameobjectdown", (pointer, gameObject) => {
    switch (gameObject) {
      case this.options:
        shipsMenuToggle = !shipsMenuToggle;
        this.shipsText.visible = shipsMenuToggle;
        this.ship1.visible = shipsMenuToggle;
        this.ship2.visible = shipsMenuToggle;
        this.ship3.visible = shipsMenuToggle;
        this.ship4.visible = shipsMenuToggle;
        break;
      case this.ship1:
        self.ship.setTexture("ship1");
        break;
      case this.ship2:
        self.ship.setTexture("ship2");
        break;
      case this.ship3:
        self.ship.setTexture("ship3");
        break;
      case this.ship4:
        self.ship.setTexture("ship4");
        break;
      default:
        self.ship.setTexture("ship1");
    }
  });

  this.socket.on("currentPlayers", function(players) {
    Object.keys(players).forEach(function(id) {
      if (players[id].playerId === self.socket.id) {
        addPlayer(self, players[id]);
      } else {
        addOtherPlayers(self, players[id]);
      }
    });
  });

  this.socket.on("newPlayer", function(playerInfo) {
    addOtherPlayers(self, playerInfo);
  });

  this.socket.on("disconnect", function(playerId) {
    self.otherPlayers.getChildren().forEach(function(otherPlayer) {
      if (playerId === otherPlayer.playerId) {
        otherPlayer.destroy();
      }
    });
  });

  this.cursors = this.input.keyboard.createCursorKeys();

  this.socket.on("playerMoved", function(playerInfo) {
    self.otherPlayers.getChildren().forEach(function(otherPlayer) {
      if (playerInfo.playerId === otherPlayer.playerId) {
        otherPlayer.setRotation(playerInfo.rotation);
        otherPlayer.setPosition(playerInfo.x, playerInfo.y);
      }
    });
  });

  this.blueScoreText = this.add.text(16, 16, "", {
    fontSize: "32px",
    fill: "#00FFFF"
  });
  this.redScoreText = this.add.text(584, 16, "", {
    fontSize: "32px",
    fill: "#FF0000"
  });

  this.bluePlayersText = this.add.text(16, 50, "", {
    fontSize: "32px",
    fill: "#00FFFF"
  });
  this.redPlayersText = this.add.text(584, 50, "", {
    fontSize: "32px",
    fill: "#FF0000"
  });

  this.socket.on("scoreUpdate", function(scores) {
    self.blueScoreText.setText("Blue: " + scores.blue);
    self.redScoreText.setText("Red: " + scores.red);
  });

  this.socket.on("playersUpdate", function(players) {
    self.bluePlayersText.setText("Nº: " + players.bluePlayers);
    self.redPlayersText.setText("Nº: " + players.redPlayers);
  });

  this.socket.on("starLocation", function(starLocation) {
    if (self.star) self.star.destroy();
    self.star = self.physics.add.image(starLocation.x, starLocation.y, "star");
    self.physics.add.overlap(
      self.ship,
      self.star,
      function() {
        this.socket.emit("starCollected");
      },
      null,
      self
    );
  });
}

function addPlayer(self, playerInfo) {
  shipNum = Math.floor(Math.random() * 4 + 1);
  shipType = "ship" + shipNum;

  self.ship = self.physics.add
    .image(playerInfo.x, playerInfo.y, shipType)
    .setOrigin(0.5, 0.5)
    .setDisplaySize(53, 40);

  if (playerInfo.team === "blue") {
    self.ship.setTint(0x00ffff);
  } else {
    self.ship.setTint(0xff0000);
  }

  self.ship.setDrag(100);
  self.ship.setAngularDrag(100);
  self.ship.setMaxVelocity(400);
}

function addOtherPlayers(self, playerInfo) {
  const otherPlayer = self.add
    .sprite(playerInfo.x, playerInfo.y, "otherPlayer")
    .setOrigin(0.5, 0.5)
    .setDisplaySize(53, 40);
  if (playerInfo.team === "blue") {
    otherPlayer.setTint(0x00ffff);
  } else {
    otherPlayer.setTint(0xff0000);
  }
  otherPlayer.playerId = playerInfo.playerId;
  self.otherPlayers.add(otherPlayer);
}

function update() {
  if (this.ship) {
    if (this.cursors.left.isDown) {
      this.ship.setAngularVelocity(-300);
    } else if (this.cursors.right.isDown) {
      this.ship.setAngularVelocity(300);
    } else {
      this.ship.setAngularVelocity(0);
    }

    if (this.cursors.up.isDown) {
      this.physics.velocityFromRotation(
        this.ship.rotation + 1.5,
        100,
        this.ship.body.acceleration
      );
    } else {
      this.ship.setAcceleration(0);
    }

    this.physics.world.wrap(this.ship, 5);

    var x = this.ship.x;
    var y = this.ship.y;
    var r = this.ship.rotation;

    if (
      this.ship.oldPosition &&
      (x !== this.ship.oldPosition.x ||
        y !== this.ship.oldPosition.y ||
        r !== this.ship.oldPosition.rotation)
    ) {
      this.socket.emit("playerMovement", {
        x: this.ship.x,
        y: this.ship.y,
        rotation: this.ship.rotation
      });
    }
    this.ship.oldPosition = {
      x: this.ship.x,
      y: this.ship.y,
      rotation: this.ship.rotation
    };
  }
}
