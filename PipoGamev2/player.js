class Player extends Phaser.GameObjects.Sprite {

    score = 0;
    lives = 3;
    scene;
    constructor(scene, x, y, sprite, animation) {
        super(scene, x, y, sprite);
        scene.add.existing(this);
        
        
        this.play(animation);
        scene.physics.world.enableBody(this);
        scene.players.add(this);
        this.scene = scene;
    }

    movePlayerManager(keys, player) {
        this.body.velocity.x = 0; 
        this.body.velocity.y = 0;

        if (keys.left.isDown && this.x > 51) {
            this.body.velocity.x = -gameSettings.playerSpeed;
        } else if (keys.right.isDown && this.x < config.width - 51) {
            this.body.velocity.x = gameSettings.playerSpeed;
        }
        if (keys.up.isDown && this.y > config.top_limit) {
            this.body.velocity.y = -gameSettings.playerSpeed;
        } else if (keys.down.isDown && player.y < config.bottom_limit) {
            this.body.velocity.y = gameSettings.playerSpeed;
        }

    }

    shoot(scene) {
        new Bullet(scene, this);
    }

    update() {
        if (this.lives == 0) {
            this.body.enable = false;
        }
    }
}