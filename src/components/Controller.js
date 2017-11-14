import Phaser from 'phaser'

import signals from '../signals'

const keys = {
  jump: [
    Phaser.Keyboard.SPACEBAR,
    Phaser.Keyboard.W
  ],
  attack: [
    Phaser.Keyboard.CONTROL,
    Phaser.Keyboard.SHIFT,
    Phaser.Keyboard.ENTER,
    Phaser.Keyboard.D
  ]
}

export default class {
  constructor (game) {
    this.game = game

    // На событие старта игры включаем игровое управление
    signals.onGameStart.add(this.enablePlayControls, this)
    // На событие геймовера игры включаем управление геймовера
    signals.onGameOver.add(this.enableGameOverControls, this)
    // На событие реплея игры включаем управление меню
    signals.onGameReplay.add(this.enableMenuControls, this)
  }

  // Включить игровое управление, в котором есть
  // прыжок и атака
  enablePlayControls () {
    // Сбрасываем всё управление
    this.disable()

    // Привязываем управление для десктопов
    if (this.game.device.desktop) {
      // Прыжок
      keys.jump
        .map(k => this.game.input.keyboard.addKey(k))
        .map(k => {
          k.onDown.add(() => {
            signals.jump.dispatch()
          }, this)
        })

      // Атака
      keys.attack
        .map(k => this.game.input.keyboard.addKey(k))
        .map(k => {
          k.onDown.add(() => {
            signals.attack.dispatch()
          }, this)
        })

    // Привязываем управление для мобилок (тапы)
    } else {
      // Прыжок
      this.game.input.onTap.add((pointer, doubleTap) => {
        if (pointer.x <= this.game.world.width / 2) signals.jump.dispatch()
      }, this)

      // Атака
      this.game.input.onTap.add((pointer, doubleTap) => {
        if (pointer.x > this.game.world.width / 2) signals.attack.dispatch()
      }, this)
    }
  }

  // Включить управление для последнего экрана с геймовером
  enableGameOverControls () {
    // Сбрасываем всё управление
    this.disable()

    // Привязываем управление для десктопов
    if (this.game.device.desktop) {
      // Делать рестарт при нажатии на любую кнопку
      this.game.input.keyboard.onDownCallback = () => {
        signals.onGameReplay.dispatch()
      }
    }
  }

  // Включить управление в меню
  enableMenuControls () {
    // Сбрасываем всё управление
    this.disable()

    // Привязываем управление для десктопов
    if (this.game.device.desktop) {
      // Стартуем при нажатии на любую кнопку
      this.game.input.keyboard.onDownCallback = () => {
        signals.onGameStart.dispatch()
      }
    }
  }

  // Отключение контроллера
  disable () {
    // Сбрасываем колбэк для нажатия на любую кнопку
    this.game.input.keyboard.onDownCallback = null
    // Сбрасываем все кнопки на клавиатуре
    this.game.input.keyboard.reset(true)
    // Сбрасываем все тапы
    this.game.input.onTap.removeAll()
  }
}
