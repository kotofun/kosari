import Phaser from 'phaser'

let ctx
let game

export default class extends Phaser.Sprite {
  constructor (context, x, y, asset, body = false) {
    ctx = context
    game = ctx.game

    super(game, x, y, asset)

    if (body) {
      this.game.physics.arcade.enable(this)
    }

    game.add.existing(this)
  }
}
