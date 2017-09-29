import Phaser from 'phaser'
import config from '../config'
import signals from '../signals'

let ctx

let startPosition = config.player.startPosition

export default class extends Phaser.Sprite {
  constructor (context) {
    ctx = context

    super(ctx.game, startPosition.x, startPosition.y, 'player')

    this.animations.add('run')
    this.animations.play('run', 30, true)

    this.game.physics.enable(this)
    this.body.setSize(19, 54, 43, 10)

    this.slowedDown = false

    signals.jump.add(this.jump, this)
    signals.attack.add(this.attack, this)

    signals.speedDown.add(this.slowDown, this)
    signals.speedReset.add(this.resetSpeed, this)
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

  attack () {
    // attack animation
  }

  slowDown () {
    this.slowedDown = true
  }

  resetSpeed () {
    this.slowedDown = false
  }
}
