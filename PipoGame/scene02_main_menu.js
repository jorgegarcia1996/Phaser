class scene02_main_menu extends Phaser.Scene {
    constructor() {
        super("mainMenu");
    }

    create() {
        this.background = this.add.tileSprite(0, 0, config.width, config.height, "background");
        this.background.setOrigin(0, 0);

        this.logo = this.add.tileSprite(config.width/2, 150, 400, 200, "Logo");
        this.onePlayerLogo = this.add.tileSprite(config.width/2 - 200, 370, 200, 200, "Pipo");
        this.TwoPlayerLogo = this.add.tileSprite(config.width/2 + 200, 370, 250, 200, "Pipos");

    }

    update() {
        this.background.tilePositionX += 1;
        this.background.alpha = 0.3;
    }
}