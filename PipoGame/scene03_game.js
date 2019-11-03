class scene03_game extends Phaser.Scene {
    constructor() {
        super("game");
    }

    create() {

        this.background = this.add.tileSprite(0, 0, config.width, config.height, "background");
        this.background.setOrigin(0, 0);
    }

    update() {
        this.background.tilePositionX += 1;
    }
}