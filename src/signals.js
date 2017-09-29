import Phaser from 'phaser'

export default {
  jump: new Phaser.Signal(),
  attack: new Phaser.Signal(),
  normalSpeed: new Phaser.Signal(),
  speedDown: new Phaser.Signal(),
  gameOver: new Phaser.Signal()
}
