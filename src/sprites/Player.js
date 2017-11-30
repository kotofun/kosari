import Phaser from 'phaser'

import signals from '../signals'
import config from '../config'

export default class extends Phaser.Sprite {
  constructor (game) {
    super(game, 0, 0, 'player')

    // Деление спрайта на именованные анимации и списком кадров в них
    this.animations.add('stand', [0])
    this.animations.add('run', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
    this.animations.add('mow', [15, 16, 17])

    // Анимация бега это стандартная анимация
    this.attackReady = true

    // Включаем физику
    this.game.physics.enable(this)
    // Устанавливаем размеры физического тела
    this.body.setSize(19, 54, 43, 10)

    // Добавляем спрайт в игровой мир
    this.game.add.existing(this)

    this.slowedDown = false

    signals.jump.add(this.jump, this)
    signals.attack.add(this.attack, this)

    signals.speedDown.add(this.slowDown, this)
    signals.speedReset.add(this.resetSpeed, this)
    signals.onGameStart.add(this.start, this)
    signals.onGameOver.add(this.stopAnimations, this)

    signals.onGamePause.add(this.stopAnimations, this)
    signals.onGameResume.add(this.playAnimations, this)

    this.startPosition = {
      x: this.game.width / 2 - this.body.offset.x - this.body.width,
      y: this.game.height - config.tileSize - this.body.offset.y - this.body.height - 1
    }

    this.reset(this.startPosition.x, this.startPosition.y)
  }

  start () {
    // Устанавливаем анимацию по-умолчанию
    this.events.onAnimationComplete.add(() => { this.animateRun() })

    // Сразу запускаем анимацию бега
    this.animateRun()
  }

  // Анимация стояния
  animateStand () { this.animations.play('stand', 30) }
  // Анимация бега
  animateRun () { this.animations.play('run', 30) }
  // Анимация кошения
  animateMow () { this.animations.play('mow', 30) }

  stopAnimations () {
    this.animations.paused = true
  }

  playAnimations () {
    this.animations.paused = false
  }

  update () {
    this.run()
  }

  run () {
    if (this.game.isStarted) {
      this.body.velocity.x = this.game.vars.speed
    }
  }

  // Игрок стоит на твердой поверхности ?
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
      this.animateMow()
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

    this.body.velocity.x = 0

    this.events.onAnimationComplete.removeAll()
    this.animateStand()

    this.attackReady = true
  }
}
