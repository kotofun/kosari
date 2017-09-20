import Phaser from 'phaser'

export default class extends Phaser.Sprite {
  constructor ({ game, x, y, speed = 0 }) {
    super(game, x, y, 'surface.grass', game.rnd.between(1, 2))

    this.game.physics.arcade.enable(this)
    this.body.allowGravity = false
    this.body.immovable = true
    this.speed = speed
  }

  set speed (value) {
    this.body.velocity.x = value
  }
}
