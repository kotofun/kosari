import Phaser from 'phaser'

export default class extends Phaser.Sprite {
  constructor (game, x, y, asset, body = false) {
    super(game, x, y, asset)

    if (body) {
      this.game.physics.arcade.enable(this)
    }

    this.game.add.existing(this)
  }
}
