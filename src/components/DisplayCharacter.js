import Phaser from 'phaser'

let ctx

export default class extends Phaser.Sprite {
  constructor (context, x, y, asset, body = false) {
    ctx = context

    super(ctx.game, x, y, asset)

    if (body) {
      this.game.physics.arcade.enable(this)
    }

    this.game.add.existing(this)
  }
}
