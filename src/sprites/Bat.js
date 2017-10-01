import Phaser from 'phaser'
import DisplayCharacter from '../components/DisplayCharacter'

let game

export default class extends DisplayCharacter {
  constructor (ctx, x, y) {
    super(ctx, x, y, 'enemy.bat', true)

    game = ctx.game

    this.body.allowGravity = false
    this.body.immovable = true

    game.add.tween(this)
      .to({ y: y - 32 }, 500, Phaser.Easing.Sinusoidal.InOut, true, 0, -1, true)
  }
}
