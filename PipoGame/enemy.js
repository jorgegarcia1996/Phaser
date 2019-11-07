class Enemy extends Phaser.GameObjects.Sprite {

    sprite;
    animation;

    constructor(scene, x, y, sprite, animation) {
        super(scene, x, y, sprite);

        scene.add.existing(this);

        this.sprite = sprite;
        this.animation = animation;

        this.play(animation);
        scene.physics.world.enableBody(this);
        scene.enemies.add(this);
    }

    move(speed) {
        this.body.velocity.x -= speed;
    }

    resetPosition(hit) {
        if (this.x < 0 || hit) {
            this.x = config.width;
            this.y = Phaser.Math.Between(config.bottom_limit, config.top_limit);
        }
    }

    update() {
        this.resetPosition(false);
    }
}