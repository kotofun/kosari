import Phaser from 'phaser'

export default class extends Phaser.Sprite {
  constructor (withBody, ...args) {
    super(...args)

    this.withBody = withBody

    if (withBody) {
      this.game.physics.arcade.enable(this)
      this.body.allowGravity = false
      this.body.immovable = true
    }
  }
}
