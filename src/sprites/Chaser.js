import Phaser from 'phaser'

import signals from '../signals'
import config from '../config'

import Ground from './Ground'
import Swamp from './Swamp'

import DisplayCharacter from './DisplayCharacter'

let _floor

export default class extends DisplayCharacter {
  constructor (game, floorManager) {
    super(game, 0, 0, 'chaser', true)

    _floor = floorManager

    // Подгружаем все анимации
    this.animations.add('stand', [0])
    this.animations.add('run', [10, 11, 12, 13, 14, 15, 16, 17, 18, 19])
    this.animations.add('mow', [2, 3, 4, 5, 6, 7, 8, 9])

    // Устанавливаем размеры физического тела
    this.body.setSize(19, 54, 43, 10)

    // Добавляем спрайт в игровой мир
    this.game.add.existing(this)

    // Флаг готовности атаки
    this.attackReady = true
    // Скорость отставания относительно игрока. (Подробнее смотреть slowDown)
    this.backlogRate = 1

    signals.speedReset.add(this.slowDown, this)
    signals.onGameStart.add(this.start, this)

    this.startPosition = {
      x: 0,
      y: this.game.height - config.tileSize - this.body.offset.y - this.body.height - 1
    }

    this.reset()
  }

  // Метод, вызываемый при старте игры
  start () {
    this.game.isPaused = false
    this.animateRun()
  }

  catch (obj, ...args) {
    return this.game.physics.arcade.collide(obj, this, ...args)
  }

  isTimeToJump () {
    const cameraOffset = Math.max(0, this.x - this.game.camera.x)
    const bodyOffset = this.body.offset.x - this.body.width / 2
    const currentTile = Math.floor((cameraOffset + bodyOffset) / config.tileSize)

    return ((_floor.getAt(currentTile) instanceof Ground) &&
      (_floor.getAt(currentTile + 1) instanceof Swamp)) ||
      (_floor.getAt(currentTile) instanceof Swamp)
  }

  update () {
    if (this.isTimeToJump() && !this.game.isPaused) this.jump()

    if (this.left <= this.game.camera.x) {
      this.backlogRate = 1
    }

    this.run()
  }

  run () {
    if (this.game.isStarted) {
      this.body.velocity.x = this.game.vars.speed * this.backlogRate
    }
  }

  // Анимация бега
  animateRun () { return this.animations.play('run', 15, true) }
  // Анимация стояния
  animateStand () { return this.animations.play('stand') }
  // Анимация кошения
  animateMow () { return this.animations.play('mow', 30, false) }

  // Косарь стоит на твердой поверхности ?
  isOnFloor () { return this.body.touching.down }

  jump () {
    if (this.isOnFloor()) {
      this.body.velocity.y = -this.game.vars.player.jumpSpeed.y
    }
  }

  mow () {
    if (this.attackReady && this.game.isStarted && !this.animations.paused) {
      this.attackReady = false
      this.game.time.events.add(Phaser.Timer.SECOND, () => { this.attackReady = true }, this).autoDestroy = true

      signals.mow.dispatch(this)
      this.animateMow()
        .onComplete
        .add(() => { this.animateRun() })
    }
  }

  // Замедление косаря.
  //
  // Если косарь будет всегда бежать со скоростью игрока, то после 
  // остановок игрока косарь не будет отставать. Для того, чтобы
  // косарь отставал после преодаления игроком препятствия вводится
  // данный параметр. Варьируется в диапазоне [0, 1],
  // при значении 1 скорость косаря идентична скорости игрока и игры,
  // при значении 0 косарь стоит на месте.
  slowDown () {
    this.backlogRate = config.chaser.backlogRate
  }

  // Сброс параметров косаря.
  // Вызывается при рестарте игры.
  reset (x, y) {
    if (!(x || y)) {
      x = this.startPosition.x
      y = this.startPosition.y
    }

    this.attackReady = true

    this.body.velocity.x = 0

    super.reset(x, y)

    this.events.onAnimationComplete.removeAll()
    this.animateStand()
  }
}
