import Phaser from 'phaser'

var ctx

export default class extends Phaser.Sprite {
  constructor (context, x, y, asset) {
    ctx = context

    super(ctx.game, x, y, asset)
  }
}
