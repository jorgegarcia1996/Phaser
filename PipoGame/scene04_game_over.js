class scene04_game_over extends Phaser.Scene {
    constructor() {
        super("gameOver");
    }

    create() {
        this.background = this.add.tileSprite(0, 0, config.width, config.height, "background");
        this.background.setOrigin(0, 0);

        this.logo = this.add.tileSprite(config.width/2, 120, 400, 200, "GameOver");
        this.onePlayerLogo = this.physics.add.sprite(config.width/2, 320, "Replay");
        this.twoPlayerLogo = this.physics.add.sprite(config.width/2, 450, "Menu");
        
        this.onePlayerLogo.setInteractive();
        this.twoPlayerLogo.setInteractive();

        this.input.on('gameobjectdown', this.startGame, this);

        this.background.alpha = 0.3;

        this.music = this.sound.add("music_gameOver");

        var musicConfig = {
            mute: false,
            volume: 1,
            rate: 1,
            detune: 0,
            seek: 0,
            loop: true,
            delay: 0
        }

        this.music.play(musicConfig);

    }

    update() {
        this.background.tilePositionX += 1;
    }

    startGame(pointer, gameObject) {
        this.music.stop();
        if (gameObject == this.onePlayerLogo) {
            this.scene.start("1Pgame");
        } else {
            this.scene.start("mainMenu");
        }
    }
}