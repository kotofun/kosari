import Phaser from 'phaser'
import Config from '../config'

var ctx

var startPosition = Config.player.startPosition

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
    let deltaX = this.position.x - startPosition.x
    let accelerationX = (-deltaX / (startPosition.x / 2))

    if (Math.abs(deltaX) > 1) {
      this.body.velocity.x = ctx.speed * accelerationX
      if (this.isOnSurface()) {
        this.body.velocity.x = ctx.speed * (1 + accelerationX)
      }
    }
  }

  // TODO: This method is needed for running on surface
  //
  // Player is moving backwards when is on the moving surface, so
  // this method should return Player position relatively to surface
  isOnSurface () {
    return true
  }
}
