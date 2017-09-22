import Phaser from 'phaser'
import config from '../config'

var ctx

var startPosition = config.player.startPosition

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

  // TODO: Check acceleration math
  run () {
    if (this.isOnSurface()) {
      this.body.velocity.x = this.game.vars.speed
    } else {
      this.body.velocity.x = 0
    }
  }

  // Player is moving backwards when is on the moving surface, so
  // this method should return Player position relatively to surface
  isOnSurface () {
    return this.body.touching.down
  }

  jump () {
    if (this.isOnSurface()) {
      this.body.velocity.y = -this.game.vars.player.jumpSpeed.y
    }
  }
}
