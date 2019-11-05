class scene03_game extends Phaser.Scene {
    constructor() {
        super("game");
    }

    create() {

        //Background
        this.background = this.add.tileSprite(0, 0, config.width, config.height, "background");
        this.background.setOrigin(0, 0);

        //World Border
        this.physics.world.setBoundsCollision();

        //Groups
        this.projectiles = this.add.group();
        this.players = this.add.group();
        this.enemies = this.physics.add.group();    
        this.items = this.physics.add.group();

        //Items
        this.generateItem(50, 50);

        this.physics.add.collider(this.items, this.items);


        //Enemies
        this.enemy1 = new Enemy(this, config.width, config.height / 2 - 80, "enemy1", "enemy1_anim");
        this.enemy2 = new Enemy(this, config.width, config.height / 2, "enemy2", "enemy2_anim");
        this.enemy3 = new Enemy(this, config.width, config.height / 2 + 80, "enemy3", "enemy3_anim");

        //enemies movement
        this.enemy1.move(100);
        this.enemy2.move(200);
        this.enemy3.move(300);


        //Player 1
        this.player1 = new Player(this, 105, config.height / 2 - 80, "player1", "player1_anim");
        this.cursorKeys = this.input.keyboard.createCursorKeys();
        this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        //Overlaps
        this.physics.add.overlap(this.projectiles, this.enemies, this.hitEnemy, null, this);
        this.physics.add.overlap(this.players, this.enemies, this.hurtPlayer, null, this);    
        this.physics.add.overlap(this.players, this.items, this.pickItem, null, this);





    }

    update() {

        //Background movement
        this.background.tilePositionX += 1;

        //Players movements manager
        this.player1.movePlayerManager(this.cursorKeys, this.player1);

        //Players shoot
        if (Phaser.Input.Keyboard.JustDown(this.spacebar)) {
            this.player1.shoot(this);
        }

        //update proyectiles
        this.projectiles.getChildren().forEach(child => {
            child.update();
        });


        //update enemies
        this.enemies.getChildren().forEach(child => {
            child.update();
        });
    }

    hitEnemy(projectile, enemy){
        projectile.destroy();
        if (Math.random() > 0.95) {
            this.generateItem(enemy.x, enemy.y);
        }
        enemy.resetPosition(true);

    }

    hurtPlayer(player, enemy) {
    enemy.resetPosition(enemy);
    player.x = 105;
    player.y = config.height / 2;
    }

    pickItem(player, item) {
        item.destroy();
    }

    generateItem(x, y) {
        var item = this.physics.add.sprite(32, 30, "items");
        this.items.add(item);
        item.x = x;
        item.y = y;
  
        if (Math.random() > 0.5) {
          item.play("note");
        } else {
          item.play("heart");
        }
        item.setVelocity(-gameSettings.powerUpVel, gameSettings.powerUpVel);
        item.setCollideWorldBounds(true);
        item.setBounce(1);
    }
}