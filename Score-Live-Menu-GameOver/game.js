var gameSettings = {
  playerSpeed: 300,
  maxPowerups: 5,
  powerUpVel: 70,
}

var config = {
  width: 800,
  height: 591,
  backgroundColor: 0x000000,
  scene: [Scene1, Scene2],
  pixelArt: true,
  physics: {
    default: "arcade",
    arcade:{
        debug: true
    }
  }
}

var game = new Phaser.Game(config);
