class Scene2 extends Phaser.Scene {
  constructor() {
    super("playGame");
  }

  create() {

    this.background = this.add.tileSprite(0, 0, config.width, config.height, "background");
    this.background.setOrigin(0, 0);

    this.enemy1 = this.add.sprite(config.width, config.height + 50, "enemy1");
    this.enemy2 = this.add.sprite(config.width, config.height / 2, "enemy2");
    this.enemy3 = this.add.sprite(config.width, config.height / 2 - 50, "dragon");

    this.enemy1.play("enemy1_anim");
    this.enemy2.play("enemy2_anim");
    this.enemy3.play("enemy3_anim");

    this.enemy1.setInteractive();
    this.enemy2.setInteractive();
    this.enemy3.setInteractive();

    this.input.on('gameobjectdown', this.destroy, this);

    this.add.text(20, 20, "Playing game", {
      font: "25px Arial",
      fill: "yellow"
    });

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

    this.player1 = this.physics.add.sprite(105, config.height / 2 - 80, "player1");
    this.player1.play("player1_anim");
    this.cursorKeys = this.input.keyboard.createCursorKeys();
    this.player1.setCollideWorldBounds(true);

    this.player2 = this.physics.add.sprite(105, config.height / 2 + 80, "player2");
    this.player2.play("player2_anim");
    this.cursorKeys = this.input.keyboard.createCursorKeys();
    this.player2.setCollideWorldBounds(true);

    this.physics.add.collider(this.player1, this.player2);
    this.physics.add.collider(this.items, this.items);

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

    this.projectiles.getChildren().forEach(child => {
      child.update();
    });

  }

  shoot(player) {
    var bullet = new Bullet(this,player);
  }

  movePlayer1Manager(){

    this.player1.setVelocity(0);

    if(this.cursorKeys.left.isDown){
      this.player1.setVelocityX(-gameSettings.playerSpeed);
    }else if(this.cursorKeys.right.isDown){
      this.player1.setVelocityX(gameSettings.playerSpeed);
    }

    if(this.cursorKeys.up.isDown){
      this.player1.setVelocityY(-gameSettings.playerSpeed);
    }else if(this.cursorKeys.down.isDown){
      this.player1.setVelocityY(gameSettings.playerSpeed);
    }
  }

  movePlayer2Manager(){

    this.player2.setVelocity(0);

    this.wasdKeys = this.input.keyboard.addKeys({
      wKey:Phaser.Input.Keyboard.KeyCodes.W,
      sKey:Phaser.Input.Keyboard.KeyCodes.S,
      aKey:Phaser.Input.Keyboard.KeyCodes.A,
      dKey:Phaser.Input.Keyboard.KeyCodes.D,
      
      });

    if(this.wasdKeys.aKey.isDown){
      this.player2.setVelocityX(-gameSettings.playerSpeed);
    }else if(this.wasdKeys.dKey.isDown){
      this.player2.setVelocityX(gameSettings.playerSpeed);
    }

    if(this.wasdKeys.wKey.isDown){
      this.player2.setVelocityY(-gameSettings.playerSpeed);
    }else if(this.wasdKeys.sKey.isDown){
      this.player2.setVelocityY(gameSettings.playerSpeed);
    }
  }

  moveEnemy(ship, speed) {
    ship.x -= speed;
    if (ship.x < 0) {
      this.resetPos(ship);
    }
  }

  resetPos(ship){
    ship.x = config.width;
    var randomY = Phaser.Math.Between(170, 450);
    ship.y = randomY;
  }

  // 1.3
  destroy(pointer, gameObject) {
    gameObject.setTexture("explosion");
    gameObject.play("explode");
  }


}
