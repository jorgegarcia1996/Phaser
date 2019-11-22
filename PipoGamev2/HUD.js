class HUD extends Phaser.Scene {
  constructor() {
    super({
      key: 'HUD'
    });
  }

  create() {
    this.score = this.add.bitmapText(10, 5, "pixelFont", `SCORE: ${this.zeroPad(this.registry.get('score'))}`, 36);
    
    const level = this.scene.get("1Pgame");
    level.events.on('scoreChange', this.updateScore, this);
  }

  updateScore() {
    this.registry.set("score", (this,registry.get("score") + 15));
    this.score = this.add.text(1, 1, "pixelFont", `Score: ${this.zeroPad(this.registry.get('score'))}`);
  }

  zeroPad(number) {
    var stringNumber = String(number);
    while (stringNumber.length < (8 || 2)) {
      stringNumber = "0" + stringNumber;
    }
    return stringNumber;
  }

  gameOver() {
    //Destuir todos los objetos
  }
}