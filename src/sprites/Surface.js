import Phaser from 'phaser'

export default class extends Phaser.Sprite {
  constructor (...args) {
    super(...args)

    this.game.physics.arcade.enable(this)
    this.body.allowGravity = false
    this.body.immovable = true
  }
}
