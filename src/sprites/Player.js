import Phaser from 'phaser'

import signals from '../signals'

export default class extends Phaser.Sprite {
  constructor (game) {
    super(game, 0, 0, 'player')

    // Деление спрайта на именованные анимации и списком кадров в них
    this.animations.add('run', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
    this.animations.add('mow', [15, 16, 17])

    // Анимация бега это стандартная анимация
    this.animationRun()
    this.attackReady = true

    this.game.physics.enable(this)
    this.body.setSize(19, 54, 43, 10)

    this.game.add.existing(this)

    this.slowedDown = false

    signals.jump.add(this.jump, this)
    signals.attack.add(this.attack, this)

    signals.speedDown.add(this.slowDown, this)
    signals.speedReset.add(this.resetSpeed, this)

    // И как только заканчивается другая анимация,
    // снова воспроизводится анимация бега
    this.events.onAnimationComplete.add(() => {
      this.animationRun()
    })

    this.startPosition = {
      x: this.game.width / 2 - this.body.offset.x - this.body.width,
      y: this.game.height - 96
    }

    this.reset(this.startPosition.x, this.startPosition.y)
  }

  update () {
    this.run()
  }

  animationRun () {
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
    if (this.attackReady) {
      this.attackReady = false
      this.game.time.events.add(Phaser.Timer.HALF, () => { this.attackReady = true }, this).autoDestroy = true

      // Анимация и звук атаки
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

  reset (x, y) {
    if (!(x || y)) {
      x = this.startPosition.x
      y = this.startPosition.y
    }

    super.reset(x, y)
  }
}
