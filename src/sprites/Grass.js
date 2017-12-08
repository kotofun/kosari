import Phaser from 'phaser'

export default class extends Phaser.Sprite {
  constructor (game) {
    super(game, 0, 0, 'grass', game.rnd.between(1, 4))

    // Create killed by default
    this.exists = false
    this.alive = false
    this.visible = false
  }
}
