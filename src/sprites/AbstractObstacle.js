import Phaser from 'phaser'

export default class extends Phaser.Sprite {
  constructor (withBody, ...args) {
    super(...args)

    // Create killed by default
    this.exists = false
    this.alive = false
    this.visible = false

    this.withBody = withBody

    if (withBody) {
      this.game.physics.arcade.enable(this)
      this.body.allowGravity = false
      this.body.immovable = true
    }
  }
}
