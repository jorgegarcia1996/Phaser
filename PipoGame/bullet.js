class Bullet extends Phaser.GameObjects.Sprite{
    player;
    constructor(scene, player){
      var x = player.x + 20;
      var y = player.y;
      
      super(scene, x, y, "bullet");
      this.player = player;
  
      scene.add.existing(this);
  
      this.play("bullet_anim");
      scene.physics.world.enableBody(this);
      this.body.velocity.x = 250;
  
      scene.projectiles.add(this);
  
    }
  
  
    update(){
      if(this.x > config.width ){
        this.destroy();
      }
    }
  }