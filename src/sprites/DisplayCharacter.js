import Phaser from 'phaser'
import signals from '../signals'

export default class extends Phaser.Sprite {
  constructor (game, x, y, asset, body = false) {
    super(game, x, y, asset)

    if (body) {
      this.game.physics.arcade.enable(this)
    }

    this.game.add.existing(this)

    this.tween = null

    signals.onGamePause.add(this.stopAnimation, this)
    signals.onGameResume.add(this.playAnimation, this)
  }

  stopAnimation () {
    this.animations.paused = true
    if (this.tween) this.tween.pause()
  }

  playAnimation () {
    this.animations.paused = false
    if (this.tween) this.tween.resume()
  }
}
