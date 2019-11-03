class scene02_main_menu extends Phaser.Scene {
    constructor() {
        super("mainMenu");
    }

    create() {
        this.background = this.add.tileSprite(0, 0, config.width, config.height, "background");
        this.background.setOrigin(0, 0);

        this.logo = this.add.tileSprite(config.width/2, 120, 400, 200, "Logo");
        this.onePlayerLogo = this.physics.add.sprite(config.width/2 - 200, 370, "Pipo");
        this.twoPlayerLogo = this.physics.add.sprite(config.width/2 + 200, 370, "Pipos");
        
        this.onePlayerLogo.setInteractive();
        this.twoPlayerLogo.setInteractive();

        this.input.on('gameobjectdown', this.startGame, this);

    }

    update() {
        this.background.tilePositionX += 1;
        this.background.alpha = 0.3;
    }

    startGame(pointer, gameObject) {
        if (gameObject == this.onePlayerLogo) {
            this.scene.start("game");
        }
    }
}