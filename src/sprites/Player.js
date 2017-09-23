import Phaser from 'phaser'
import config from '../config'

let ctx

let startPosition = config.player.startPosition

export default class extends Phaser.Sprite {
  constructor (context) {
    ctx = context

    super(ctx.game, startPosition.x, startPosition.y, 'player')

    this.startPosition = { x: this.x, y: this.y }
    this.force = { x: 0, y: 0 }
    this.game.physics.enable(this)
    this.body.setSize(20, 56, this.width - 20, 0)
  }

  update () {
    this.run()
  }

  run () {
    this.body.velocity.x = this.game.vars.speed
  }

  // Check if player is on surface
  isOnFloor () {
    return this.body.touching.down
  }

  jump () {
    if (this.isOnFloor()) {
      this.body.velocity.y = -this.game.vars.player.jumpSpeed.y
    }
  }
}
