import Phaser from 'phaser'
import DisplayCharacter from '../components/DisplayCharacter'

let game

export default class extends DisplayCharacter {
  constructor (ctx, x, y) {
    super(ctx, x, y, 'enemy.bat', true)

    this.alive = false

    game = ctx.game

    this.body.setSize(40, 20, 12, 24)

    this.animations.add('idle')
    this.animations.play('idle', 24, true)

    this.body.allowGravity = false
    this.body.immovable = true
  }

  reset (x, y, ...args) {
    super.reset(x, y, ...args)

    this.tween = game.add.tween(this)
      .to({ y: y - 32 }, 500, Phaser.Easing.Sinusoidal.InOut, true, 0, -1, true)
  }

  kill (...args) {
    game.tweens.remove(this.tween)

    super.kill(...args)
  }
}
