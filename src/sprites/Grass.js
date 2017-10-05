import Phaser from 'phaser'

export default class extends Phaser.Sprite {
  constructor (game) {
    super(game, 0, 0, 'surface.grass', game.rnd.between(1, 2))

    // Create killed by default
    this.exists = false
    this.alive = false
    this.visible = false
  }
}
