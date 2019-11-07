class Scene2 extends Phaser.Scene {
  constructor() {
    super("playGame");
  }

  create() {

    this.background = this.add.tileSprite(0, 0, config.width, config.height, "background");
    this.background.setOrigin(0, 0);

    this.enemies = this.physics.add.group();


    this.enemy1 = this.physics.add.sprite(config.width, config.height + 50, "enemy1");
    this.enemy2 = this.physics.add.sprite(config.width, config.height / 2, "enemy2");
    this.enemy3 = this.physics.add.sprite(config.width, config.height / 2 - 50, "enemy3");

    this.enemies.add(this.enemy1);
    this.enemies.add(this.enemy2);
    this.enemies.add(this.enemy3);

    this.enemy1.play("enemy1_anim");
    this.enemy2.play("enemy2_anim");
    this.enemy3.play("enemy3_anim");

    this.physics.world.setBoundsCollision();

    this.items = this.physics.add.group();

    for (var i = 0; i < gameSettings.maxPowerups; i++) {
      var item = this.physics.add.sprite(32, 30, "items");
      this.items.add(item);
      item.setRandomPosition(0, 0, game.config.width, game.config.height);

      if (Math.random() > 0.5) {
        item.play("note");
      } else {
        item.play("heart");
      }
      item.setVelocity(gameSettings.powerUpVel, gameSettings.powerUpVel);
      item.setCollideWorldBounds(true);
      item.setBounce(1);

    }

    this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.m = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M);

    this.projectiles = this.add.group();
    this.players = this.add.group();

    this.player1 = this.physics.add.sprite(105, config.height / 2 - 80, "player1");
    this.player1.play("player1_anim");
    this.cursorKeys = this.input.keyboard.createCursorKeys();
    this.player1.setCollideWorldBounds(true);

    this.player2 = this.physics.add.sprite(105, config.height / 2 + 80, "player2");
    this.player2.play("player2_anim");
    this.cursorKeys = this.input.keyboard.createCursorKeys();
    this.player2.setCollideWorldBounds(true);

    this.players.add(this.player1);
    this.players.add(this.player2);

    this.physics.add.collider(this.players, this.players);
    this.physics.add.collider(this.items, this.items);

    this.physics.add.overlap(this.players, this.items, this.pickItem, null, this);
    this.physics.add.overlap(this.projectiles, this.enemies, this.hitEnemy, null, this);
    this.physics.add.overlap(this.players, this.enemies, this.hurtPlayer, null, this);


    var graphics = this.add.graphics();
    graphics.fillStyle(0x000000, 1);
    graphics.beginPath();
    graphics.moveTo(0, 0);
    graphics.lineTo(config.width, 0);
    graphics.lineTo(config.width, 30);
    graphics.lineTo(0, 30);
    graphics.lineTo(0, 0);
    graphics.closePath();
    graphics.fillPath();

    this.score = 0;
    this.lives = 3;

    var scoreFormated = this.zeroPad(this.score, 6);
    this.scoreLabel = this.add.bitmapText(10, 5, "pixelFont", "SCORE " + scoreFormated, 36);
    this.livesLabel = this.add.bitmapText(700, 5, "pixelFont", "LIVES " + this.lives, 36);


  }

  zeroPad(number, size) {
    var stringNumber = String(number);
    while (stringNumber.length < (size || 2)) {
      stringNumber = "0" + stringNumber;
    }
    return stringNumber;
  }

  pickItem(player, powerUp) {
    powerUp.disableBody(true, true);
  }

  hitEnemy(projectile, enemy) {
    projectile.destroy();
    this.resetPos(enemy);
    this.score += 15;
    var scoreFormated = this.zeroPad(this.score, 6);
    this.scoreLabel.text = "SCORE " + scoreFormated;
  }

  hurtPlayer(player, enemy) {
    this.resetPos(enemy);
    player.x = 105;
    player.y = config.height / 2;
    if (this.lives <= 0) {
      //TODO GAMEOVER
    } else {
      this.lives -= 1;
      this.livesLabel.text = "LIVES " + this.lives;
    }
  }

  update() {

    this.moveEnemy(this.enemy1, 3);
    this.moveEnemy(this.enemy2, 4);
    this.moveEnemy(this.enemy3, 4.5);

    this.background.tilePositionX += 1;

    this.movePlayer1Manager();
    this.movePlayer2Manager();

    if (Phaser.Input.Keyboard.JustDown(this.spacebar)) {
      this.shoot(this.player2);
    }

    if (Phaser.Input.Keyboard.JustDown(this.m)) {
      this.shoot(this.player1);
    }

    if (this.player1.y < config.top_height) {
      this.player1.y = config.top_height;
    }

    if (this.player1.y > config.bottom_height) {
      this.player1.y = config.bottom_height;
    }

    if (this.player2.y < config.top_height) {
      this.player2.y = config.top_height;
    }

    if (this.player2.y > config.bottom_height) {
      this.player2.y = config.bottom_height;
    }

    this.projectiles.getChildren().forEach(child => {
      child.update();
    });

  }

  shoot(player) {
    var bullet = new Bullet(this, player);
  }

  movePlayer1Manager() {

    this.player1.setVelocity(0);

    if (this.cursorKeys.left.isDown) {
      this.player1.setVelocityX(-gameSettings.playerSpeed);
    } else if (this.cursorKeys.right.isDown) {
      this.player1.setVelocityX(gameSettings.playerSpeed);
    }

    if (this.cursorKeys.up.isDown) {
      this.player1.setVelocityY(-gameSettings.playerSpeed);
    } else if (this.cursorKeys.down.isDown) {
      this.player1.setVelocityY(gameSettings.playerSpeed);
    }
  }

  movePlayer2Manager() {

    this.player2.setVelocity(0);

    this.wasdKeys = this.input.keyboard.addKeys({
      wKey: Phaser.Input.Keyboard.KeyCodes.W,
      sKey: Phaser.Input.Keyboard.KeyCodes.S,
      aKey: Phaser.Input.Keyboard.KeyCodes.A,
      dKey: Phaser.Input.Keyboard.KeyCodes.D,

    });

    if (this.wasdKeys.aKey.isDown) {
      this.player2.setVelocityX(-gameSettings.playerSpeed);
    } else if (this.wasdKeys.dKey.isDown) {
      this.player2.setVelocityX(gameSettings.playerSpeed);
    }

    if (this.wasdKeys.wKey.isDown) {
      this.player2.setVelocityY(-gameSettings.playerSpeed);
    } else if (this.wasdKeys.sKey.isDown) {
      this.player2.setVelocityY(gameSettings.playerSpeed);
    }
  }

  moveEnemy(ship, speed) {
    ship.x -= speed;
    if (ship.x < 0) {
      this.resetPos(ship);
    }
  }

  resetPos(enemy) {
    enemy.x = config.width;
    var randomY = Phaser.Math.Between(config.top_height, config.bottom_height);
    enemy.y = randomY;
  }

  destroy(pointer, gameObject) {
    gameObject.setTexture("explosion");
    gameObject.play("explode");
  }


}
