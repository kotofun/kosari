import Phaser from 'phaser'

export default {
  // controller signals
  jump: new Phaser.Signal(),
  attack: new Phaser.Signal(),
  mow: new Phaser.Signal(),

  // terrain signals
  terrainChanged: new Phaser.Signal(),
  terrainCreated: new Phaser.Signal(),

  // floor signals
  floorHold: new Phaser.Signal(),

  // game & player speed signals
  gameStart: new Phaser.Signal(),
  speedUp: new Phaser.Signal(),
  speedReset: new Phaser.Signal(),
  speedDown: new Phaser.Signal(),

  // global game signals
  gameOver: new Phaser.Signal()
}
