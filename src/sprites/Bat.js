import Phaser from 'phaser'
import Enemy from '../components/Enemy'

export default class extends Enemy {
  constructor (ctx) {
    super(ctx, 'enemy.bat', true)

    this.body.setSize(40, 20, 12, 24)

    this.animations.add('idle')
    this.animations.play('idle', 24, true)
  }

  reset (x, y, ...args) {
    super.reset(x, y, ...args)

    this.tween = this.game.add.tween(this)
      .to({ y: y - 32 }, 500, Phaser.Easing.Sinusoidal.InOut, true, 0, -1, true)
  }

  kill (...args) {
    this.game.tweens.remove(this.tween)

    super.kill(...args)
  }
}
