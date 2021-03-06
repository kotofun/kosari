import Phaser from 'phaser'
import AbstractEnemy from './AbstractEnemy'
import config from '../config'

export default class extends AbstractEnemy {
  constructor (game) {
    super(game, 'enemies/bat', true)

    this.body.setSize(40, 20, 12, 24)

    this.animations.add('idle')
    this.animations.play('idle', 24, true)
  }

  reset (x, y, ...args) {
    super.reset(x, y, ...args)

    this.tween = this.game.add.tween(this)
      .to({ y: y + 12 - config.tileSize * 1.25 }, 700, Phaser.Easing.Sinusoidal.InOut, true, 0, -1, true)
  }

  kill (...args) {
    this.game.tweens.remove(this.tween)

    super.kill(...args)
  }
}
