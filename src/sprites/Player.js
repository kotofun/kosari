import Phaser from 'phaser'

import signals from '../signals'
import config from '../config'

import DisplayCharacter from './DisplayCharacter'

export default class extends DisplayCharacter {
  constructor (game) {
    super(game, 0, 0, 'player', true)

    // Деление спрайта на именованные анимации и списком кадров в них
    this.animations.add('stand', [0])
    this.animations.add('run', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
    this.animations.add('mow', [15, 16, 17])

    // Анимация бега это стандартная анимация
    this.attackReady = true
    this.slowedDown = false
    this.slowdownRate = 1

    // Включаем физику
    this.game.physics.enable(this)
    // Устанавливаем размеры физического тела
    this.body.setSize(19, 54, 43, 10)

    signals.jump.add(this.jump, this)
    signals.attack.add(this.attack, this)

    signals.speedDown.add(this.slowDown, this)
    signals.onGameStart.add(this.start, this)

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

  update () {
    this.run()
  }

  run () {
    if (this.game.isStarted) {
      this.body.velocity.x = this.game.vars.speed * this.slowdownRate
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
    // понижаем скорость на коэффициент замедления
    this.slowedDown = true
    this.slowdownRate = config.player.slowdownRate
    // добавляем таймер кулдауна
    this.game.time.events.add(
      config.player.cooldown, // через какое время сработает таймер
      () => { this.resetSpeed() }, // функция, которая выполнится
      this // контекст для функции
    ).autoDestroy = true // удалить таймер автоматически
  }

  resetSpeed () {
    // сбрасываем коэффициент замедления
    this.slowedDown = false
    this.slowdownRate = 1
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
