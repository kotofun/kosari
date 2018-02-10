import Phaser from 'phaser'
import AbstractEnemy from './AbstractEnemy'
import config from '../config'

export default class extends AbstractEnemy {
  constructor (game) {
    super(game, 'enemies/corgy', true)

    this.body.setSize(25, 30, 20, 55)

    this.animations.add('idle')
    this.animations.play('idle', 10, true)
  }

  reset (x, y, ...args) {
    super.reset(x, y - 10, ...args)

    this.tween = this.game.add.tween(this)
      .to({ y: y - 2 - config.tileSize * 1.25 }, 700, Phaser.Easing.Sinusoidal.InOut, true, 0, -1, true)
  }

  kill (...args) {
    this.game.tweens.remove(this.tween)

    super.kill(...args)
  }
}
