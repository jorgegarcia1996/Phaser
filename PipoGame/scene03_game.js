class scene03_game extends Phaser.Scene {
    constructor() {
        super("game");
    }

    create() {

        this.background = this.add.tileSprite(0, 0, config.width, config.height, "background");
        this.background.setOrigin(0, 0);

        this.players = this.add.group();

        this.player1 = new Player(this, 105, config.height / 2 - 80, "player1", "player1_anim");
        this.cursorKeys = this.input.keyboard.createCursorKeys();
        this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.projectiles = this.add.group();




    }

    update() {
        this.background.tilePositionX += 1;
        this.player1.movePlayerManager(this.cursorKeys, this.player1);

        if (Phaser.Input.Keyboard.JustDown(this.spacebar)) {
            this.player1.shoot(this);
        }

        this.projectiles.getChildren().forEach(child => {
            child.update();
        });
    }
}