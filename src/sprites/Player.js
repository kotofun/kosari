import Phaser from 'phaser'

import signals from '../signals'

export default class extends Phaser.Sprite {
  constructor (game) {
    const x = game.width / 2 - 31 // (body offset + body width) / 2
    const y = game.height - 96 // player height + starting floor height
    super(game, x, y, 'player')

    this.animations.add('run', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
    this.animations.add('mow', [15, 16, 17])

    this.animation_run()
    this.attack_ready = true

    this.game.physics.enable(this)
    this.body.setSize(19, 54, 43, 10)

    this.game.add.existing(this)

    this.slowedDown = false

    signals.jump.add(this.jump, this)
    signals.attack.add(this.attack, this)

    signals.speedDown.add(this.slowDown, this)
    signals.speedReset.add(this.resetSpeed, this)

    this.events.onAnimationComplete.add(() => {
      this.animation_run()
    })
  }

  update () {
    this.run()
  }

  animation_run () {
    this.animations.play('run', 30, true)
  }

  run () {
    this.body.velocity.x = this.game.vars.speed
  }

  // Check if player is on surface
  isOnFloor () { return this.body.touching.down }

  jump () {
    if (this.isOnFloor()) {
      this.body.velocity.y = -this.game.vars.player.jumpSpeed.y
      this.game.sounds.jump.play()
    }
  }

  attack () {
    if (this.attack_ready) {
      this.attack_ready = false
      this.game.time.events.add(Phaser.Timer.HALF, ()=>{this.attack_ready = true}, this).autoDestroy = true

      this.game.sounds.attack.play()
      signals.mow.dispatch(this)
      this.animations.play('mow', 30, false)
    }
  }

  slowDown () {
    this.slowedDown = true
  }

  resetSpeed () {
    this.slowedDown = false
  }
}
