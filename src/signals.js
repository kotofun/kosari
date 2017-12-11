import Phaser from 'phaser'

export default {
  // controller signals
  onJumpStart: new Phaser.Signal(),
  onJumpEnd: new Phaser.Signal(),
  attack: new Phaser.Signal(),
  mow: new Phaser.Signal(),

  // terrain signals
  terrainChanged: new Phaser.Signal(),
  terrainCreated: new Phaser.Signal(),

  // floor signals
  floorHold: new Phaser.Signal(),

  // game & player speed signals
  onGameStart: new Phaser.Signal(),
  onGameOver: new Phaser.Signal(),
  onGameReplay: new Phaser.Signal(),
  onGamePause: new Phaser.Signal(),
  onGameResume: new Phaser.Signal(),

  speedUp: new Phaser.Signal(),
  speedReset: new Phaser.Signal(),
  speedDown: new Phaser.Signal(),
  speedUpdate: new Phaser.Signal()
}
