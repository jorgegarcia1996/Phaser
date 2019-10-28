class Player extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, sprite, animation) {
        super(scene, x, y, sprite);

        scene.add.existing(this);

        this.play(animation);
        scene.physics.world.enableBody(this);
    }

    movePlayerManager() {

    }

    shoot() {

    }

    hurtPlayer(enemy) {

    }

    pickItem(item) {

    }

    update() {

    }
}