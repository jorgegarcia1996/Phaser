var gameSettings = {
    playerSpeed: 300,
    maxPowerups: 4,
    powerUpVel: 70,
  }
  
  var config = {
    top_height:170,
    bottom_height: 473,
    width: 800,
    height: 591,
    backgroundColor: 0x000000,
    scene: [scene01_loader, scene02_main_menu, scene03_game, scene04_game_over],
    pixelArt: true,
    physics: {
      default: "arcade",
      arcade:{
          debug: true
      }
    }
  }
  
  var game = new Phaser.Game(config);