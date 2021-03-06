import Phaser from 'phaser'

import signals from '../signals'
import config from '../config'

const keys = {
  pause: Phaser.Keyboard.ESC,
  replay: Phaser.Keyboard.R,
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
    signals.onGamePause.add(this.enablePauseControls, this)
    signals.onGameResume.add(this.enablePlayControls, this)
  }

  // Включить игровое управление, в котором есть
  // прыжок и атака
  enablePlayControls () {
    // Сбрасываем всё управление
    this.disable()

    // Блочим нажатия на alt или tab, чтобы не появлялось меню паузы
    this.preventKeys()

    // Привязываем управление для десктопов
    if (this.game.device.desktop) {
      // Прыжок
      keys.jump
        .map(k => this.game.input.keyboard.addKey(k))
        .map(k => {
          k.onDown.add(() => {
            signals.onJumpStart.dispatch()
          })
          k.onUp.add(() => {
            signals.onJumpEnd.dispatch()
          })
        })

      // Атака
      keys.attack
        .map(k => this.game.input.keyboard.addKey(k))
        .map(k => {
          k.onDown.add(() => {
            signals.attack.dispatch()
          }, this)
        })

      this.game.input.keyboard.addKey(keys.pause).onDown.add(() => {
        signals.onGamePause.dispatch()
      })

    // Привязываем управление для мобилок (тапы)
    } else {
      // Прыжок
      this.game.input.onDown.add((pointer) => {
        if (pointer.x <= this.game.world.width / 2) signals.onJumpStart.dispatch()
      }, this)

      this.game.input.onUp.add((pointer) => {
        if (pointer.x <= this.game.world.width / 2) signals.onJumpEnd.dispatch()
      }, this)

      // Атака
      this.game.input.onTap.add((pointer, doubleTap) => {
        if (pointer.x > this.game.world.width / 2) signals.attack.dispatch()
      }, this)
    }
  }

  // Включить управление для меню паузы
  enablePauseControls () {
    this.disable()

    // Привязываем клавишу ESC
    this.game.input.keyboard.addKey(keys.pause).onDown.add(() => {
      signals.onGameResume.dispatch()
    }, this)
  }

  // Включить управление для последнего экрана с геймовером
  enableGameOverControls () {
    // Сбрасываем всё управление
    this.disable()

    // Привязываем управление для десктопов
    if (this.game.device.desktop) {
      // Делать рестарт при нажатии на любую кнопку
      this.game.input.keyboard.addKey(keys.replay).onDown.add(() => {
        signals.onGameReplay.dispatch()
      })
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

  preventKeys () {
    document.onkeydown = function (e) {
      if (e.keyCode === Phaser.KeyCode.TAB ||
          e.keyCode === Phaser.KeyCode.ALT) {
        e.preventDefault()
      }
    }
  }
}
