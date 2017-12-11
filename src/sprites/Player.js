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

    // Включаем физику
    this.game.physics.enable(this)
    // Устанавливаем размеры физического тела
    this.body.setSize(19, 54, 43, 10)

    this.isJumping = false
    this.jumpTimer = 0

    // пришел сигнал для начала прыжка?
    signals.onJumpStart.add(() => {
      // проверим находится ли игрок на земле,
      // чтобы не начинать повторный прыжок в воздухе
      if (this.isOnFloor()) {
        // устанавливаем флаг прыжка
        this.isJumping = true
        // записываем текущее время для проверки
        // длительности прыжка
        this.jumpTimer = this.game.time.time
      }
    })

    // пришел сигнал для окончания прыжка?
    signals.onJumpEnd.add(() => {
      // отключаем режим прыжка
      this.isJumping = false
      // сбрасываем время начала текущего прыжка
      this.jumpTimer = 0
    })

    signals.attack.add(this.attack, this)

    signals.onGameStart.add(this.start, this)

    this.startPosition = {
      x: this.game.width / 2 - this.body.offset.x - this.body.width,
      y: this.game.height - config.tileSize - this.body.offset.y - this.body.height - 1
    }

    this.speed = 0

    this.reset(this.startPosition.x, this.startPosition.y)
  }

  start () {
    // устанавливаем начальную скорость
    this.speed = this.game.vars.speed

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
    // если игра еще не начата или на паузе - выходим
    if (!this.game.isStarted || this.game.isPaused) return

    // провереем воткнулся ли игрок в препятствие
    // пока мы не проверяем в кого именно воткнулись
    if (this.isTouchedRight()) {
      // включаем режим куллдауна
      this.enableCooldownMode()

      // оповещаем всех о том, что мы воткнулись
      signals.speedDown.dispatch()
    } else {
      // бежим, если ни во что не воткнулись
      this.run()
    }

    // игрок в прыжке?
    if (this.isJumping) {
      // продолжаем прыгать
      this.jump()
    }
  }

  run () {
    if (this.game.isStarted) {
      this.body.velocity.x = this.speed

      signals.speedUpdate.dispatch(this.speed / 5)
    }
  }

  isTouchedRight () {
    return this.body.touching.right || this.body.wasTouching.right
  }

  // Игрок стоит на твердой поверхности ?
  isOnFloor () { return this.body.touching.down || this.body.wasTouching.down }

  jump () {
    // определяем сколько длится прыжок
    const duration = this.game.time.time - this.jumpTimer
    // прыжок по времени не превысил значение в конфиге?
    if (duration <= config.player.jumpDuration) {
      // продолжаем прыгать
      this.body.velocity.y = -this.game.vars.player.jumpSpeed.y
    } else {
      // отключаем прыжок
      this.jumpTimer = 0
      this.isJumping = false
    }

    // игрок находится на земле?
    if (this.isOnFloor()) {
      // проиграем звук прыжка
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

  enableCooldownMode () {
    // понижаем скорость на коэффициент замедления
    this.speed = this.game.vars.speed * config.player.slowdownRate

    // если событие по таймеру было уже создано
    if (this.cooldownEvent) {
      // удаляем его
      this.game.time.events.remove(this.cooldownEvent)
    }

    // добавляем отмену кулдауна по таймеру
    this.cooldownEvent = this.game.time.events.add(
      config.player.cooldown, // через какое время сработает таймер
      () => { this.resetSpeed() }, // функция, которая выполнится
      this // контекст для функции
    )
  }

  resetSpeed () {
    // восстанавливаем скорость
    this.speed = this.game.vars.speed

    // оповещаем всех о сбросе скорости
    signals.speedReset.dispatch()
  }

  reset (x, y) {
    if (!(x || y)) {
      x = this.startPosition.x
      y = this.startPosition.y
    }

    super.reset(x, y)

    this.body.velocity.x = 0
    this.speed = 0

    this.events.onAnimationComplete.removeAll()
    this.animateStand()

    this.attackReady = true
  }
}
