class scene01_loader extends Phaser.Scene {
    constructor() {
        super("bootGame");
    }

    //Precarga de los recursos
    preload() {
        //Imagenes
        this.load.image("background", "assets/images/background.png");
        this.load.image("Pipo", "assets/images/Pipo.png");
        this.load.image("Pipos", "assets/images/Pipos.png");
        this.load.image("Replay", "assets/images/Replay.png");
        this.load.image("Menu", "assets/images/Menu.png");
        this.load.image("Logo", "assets/images/Logo.png");
        this.load.image("GameOver", "assets/images/GameOver.png");

        //Sprites
        this.load.spritesheet("enemy1", "assets/spritesheets/Enemy1.png", {
            frameWidth: 77,
            frameHeight: 68
        });
        this.load.spritesheet("enemy2", "assets/spritesheets/Enemy2.png", {
            frameWidth: 83,
            frameHeight: 70
        });
        this.load.spritesheet("enemy3", "assets/spritesheets/Enemy3.png", {
            frameWidth: 73,
            frameHeight: 70
        });
        this.load.spritesheet("explosion", "assets/spritesheets/explosion.png", {
            frameWidth: 48,
            frameHeight: 48
        });

        this.load.spritesheet("player1", "assets/spritesheets/Car1.png", {
            frameWidth: 102,
            frameHeight: 70
        });

        this.load.spritesheet("player2", "assets/spritesheets/Car2.png", {
            frameWidth: 105,
            frameHeight: 70
        });

        this.load.spritesheet("items", "assets/spritesheets/Items.png", {
            frameWidth: 32.5,
            frameHeight: 30
        });

        this.load.spritesheet("bullet", "assets/spritesheets/Proyectil.png", {
            frameWidth: 16,
            frameHeight: 14
        });

        //Musica y sonidos
        
        this.load.audio("audio_poi", "./assets/audio/sounds/poi.mp3");
        this.load.audio("audio_throw", "./assets/audio/sounds/throw.mp3");
        this.load.audio("audio_explosion", "./assets/audio/sounds/creeper-explosion.mp3");
        this.load.audio("audio_1up", "./assets/audio/sounds/1upsound.mp3");
        
        this.load.audio("music_menu", "./assets/audio/music/MainMenu.mp3");
        this.load.audio("music_game", "./assets/audio/music/MainMusic.mp3");
        this.load.audio("music_hurryUp", "./assets/audio/music/HurryUp.mp3");
        this.load.audio("music_gameOver", "./assets/audio/music/GameOver.mp3");


        //Fuente
        this.load.bitmapFont("pixelFont", "assets/font/font.png", "assets/font/font.xml");

    }

    //Animaciones
    create() {
        this.add.text(20, 20, "Loading game...");

        this.anims.create({
            key: "enemy1_anim",
            frames: this.anims.generateFrameNumbers("enemy1"),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: "enemy2_anim",
            frames: this.anims.generateFrameNumbers("enemy2"),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: "enemy3_anim",
            frames: this.anims.generateFrameNumbers("enemy3"),
            frameRate: 8,
            repeat: -1
        });

        this.anims.create({
            key: "explode",
            frames: this.anims.generateFrameNumbers("explosion"),
            frameRate: 20,
            repeat: 0,
            hideOnComplete: true
        });

        this.anims.create({
            key: "note",
            frames: this.anims.generateFrameNumbers("items", {
                start: 0,
                end: 3
            }),
            frameRate: 15,
            repeat: -1
        });

        this.anims.create({
            key: "heart",
            frames: this.anims.generateFrameNumbers("items", {
                start: 4,
                end: 8
            }),
            frameRate: 15,
            repeat: -1
        });

        this.anims.create({
            key: "player1_anim",
            frames: this.anims.generateFrameNumbers("player1"),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: "bullet_anim",
            frames: this.anims.generateFrameNumbers("bullet"),
            frameRate: 20,
            repeat: -1
        });

        this.anims.create({
            key: "player2_anim",
            frames: this.anims.generateFrameNumbers("player2"),
            frameRate: 3,
            repeat: -1
        });

        this.scene.start("mainMenu");
    }
}