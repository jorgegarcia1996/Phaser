class scene03_2Pgame extends Phaser.Scene {
    constructor() {
        super("2Pgame");
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

        //Colliders
        this.physics.add.collider(this.items, this.items);
        this.physics.add.collider(this.players, this.players);


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
        this.shootP1 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M);

        //Player 2

        this.player2 = new Player(this, 105, config.height / 2 + 80, "player2", "player2_anim");
        this.wasdKeys = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D,
        });
        this.shootP2 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);



        //Overlaps
        this.physics.add.overlap(this.projectiles, this.enemies, this.hitEnemy, null, this);
        this.physics.add.overlap(this.players, this.enemies, this.hurtPlayer, null, this);
        this.physics.add.overlap(this.players, this.items, this.pickItem, null, this);

        //HUD
        var graphics = this.add.graphics();
        graphics.fillStyle(0x000000, 1);
        graphics.beginPath();
        graphics.moveTo(0, 0);
        graphics.lineTo(config.width, 0);
        graphics.lineTo(config.width, 65);
        graphics.lineTo(0, 65);
        graphics.lineTo(0, 0);
        graphics.closePath();
        graphics.fillPath();

        //Puntuación y vidas del P1
        var scoreP1Formated = this.zeroPad(this.player1.score, 6);
        this.scoreP1Label = this.add.bitmapText(10, 5, "pixelFont", "P1:  SCORE " + scoreP1Formated, 36);
        this.livesP1Label = this.add.bitmapText(650, 5, "pixelFont", "LIVES " + this.player1.lives, 36);

        //Puntuación y vidas del P2
        var scoreP2Formated = this.zeroPad(this.player2.score, 6);
        this.scoreP2Label = this.add.bitmapText(10, 40, "pixelFont", "P2: SCORE " + scoreP2Formated, 36);
        this.livesP2Label = this.add.bitmapText(650, 40, "pixelFont", "LIVES " + this.player2.lives, 36);

        //Sonidos
        this.poiSound = this.sound.add("audio_poi");
        this.shootSound = this.sound.add("audio_throw");
        this.explosionSound = this.sound.add("audio_explosion");
        this.UpSound = this.sound.add("audio_1up");

        //Musica

        this.mainMusic = this.sound.add("music_game");
        this.mainMusicConfig = {
            mute: false,
            volume: 1,
            rate: 1,
            detune: 0,
            seek: 0,
            loop: true,
            delay: 0
        };
        this.mainMusic.play(this.mainMusicConfig);

        this.hurryUpMusic = this.sound.add("music_hurryUp");
        this.hurryUpMusicConfig = {
            mute: false,
            volume: 1,
            rate: 1,
            detune: 0,
            seek: 0,
            loop: true,
            delay: 0
        };


    }

    update() {

        //Background movement
        this.background.tilePositionX += 1;

        //Players movements manager
        this.player1.movePlayerManager(this.cursorKeys, this.player1);
        this.player2.movePlayerManager(this.wasdKeys, this.player2);

        //Players shoot
        if (Phaser.Input.Keyboard.JustDown(this.shootP1)) {
            this.player1.shoot(this);
            this.shootSound.play();
        }

        if (Phaser.Input.Keyboard.JustDown(this.shootP2)) {
            this.player2.shoot(this);
            this.shootSound.play();
        }

        this.players.getChildren().forEach(child => {
            child.update();
        });

        //update proyectiles
        this.projectiles.getChildren().forEach(child => {
            child.update();
        });


        //update enemies
        this.enemies.getChildren().forEach(child => {
            child.update();
        });
    }

    hitEnemy(projectile, enemy) {
        var explosion = new Explosion(this, enemy.x, enemy.y);
        this.explosionSound.play();
        projectile.destroy();
        if (Math.random() > 0.95) {
            this.generateItem(enemy.x, enemy.y);
        }
        enemy.resetPosition(true);

        if (projectile.player == this.player1) {
            this.player1.score += 15;
            var scoreP1Formated = this.zeroPad(this.player1.score, 6);
            this.scoreP1Label.text = "P1:  SCORE " + scoreP1Formated;
        } else {

            this.player2.score += 15;
            var scoreP2Formated = this.zeroPad(this.player2.score, 6);
            this.scoreP2Label.text = "P2:  SCORE " + scoreP2Formated;
        }


    }

    hurtPlayer(player, enemy) {
        enemy.resetPosition(enemy);
        if (player.alpha < 1) {
            return;
        }

        var explosion = new Explosion(this, player.x, player.y);
        this.poiSound.play();

        if (player.lives < 3) {
            this.mainMusic.stop();
            this.hurryUpMusic.play(this.hurryUpMusicConfig);
        }

        if (this.player1.lives < 2 && this.player2.lives < 2) {
            this.hurryUpMusic.stop();
            this.scene.start("gameOver");
        } else {
            player.lives--;
            if (player == this.player1) {
                this.livesP1Label.text = "LIVES " + player.lives;
            } else {
                this.livesP2Label.text = "LIVES " + player.lives;
            }
        }

        this.time.addEvent({
            delay: 1000,
            callback: this.resetPlayer(player),
            callbackScope: this,
            loop: false
        });

    }

    resetPlayer(player) {
        player.x = -100;
        player.y = Phaser.Math.Between(config.bottom_limit, config.top_limit);

        if (player.lives > 0) {
            player.alpha = 0.5;
            
            var tween = this.tweens.add({
                targets: player,
                x: 100,
                ease: 'Power1',
                duration: 1500,
                repeat: 0,
                onComplete: function () {
                    player.alpha = 1;
                },
                callbackScope: this
            });
        }
    }

    pickItem(player, item) {
        item.destroy();
        this.UpSound.play();
        player.lives++;
        if (this.player1.lives > 2 && this.player2.lives > 2) {
            this.hurryUpMusic.stop();
            this.mainMusic.play(this.mainMusicConfig);
        }
        if (player == this.player1) {
            this.livesP1Label.text = "LIVES " + player.lives;
        } else {
            this.livesP2Label.text = "LIVES " + player.lives;
        }

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

    zeroPad(number, size) {
        var stringNumber = String(number);
        while (stringNumber.length < (size || 2)) {
            stringNumber = "0" + stringNumber;
        }
        return stringNumber;
    }
}