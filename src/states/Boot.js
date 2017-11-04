import Phaser from 'phaser'
import WebFont from 'webfontloader'
import config from '../config'

import Controller from '../components/Controller'

const handleCorrect = game => {
  if (game.state.current !== 'Game') game.paused = false
  document.getElementById('rotate').style.display = 'none'
}

const handleIncorrect = game => {
  if (game.state.current === 'Game') game.paused = true
  document.getElementById('rotate').style.display = 'block'
}

export default class extends Phaser.State {
  init () {
    Phaser.Canvas.setImageRenderingCrisp(this.game.canvas)

    this.game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE
    this.game.scale.setUserScale(this.game.scaleFactor, this.game.scaleFactor)

    if (!this.game.device.desktop) {
      this.game.scale.forceLandscape = true
      this.game.scale.enterIncorrectOrientation.add(handleIncorrect, this, 0, this.game)
      this.game.scale.leaveIncorrectOrientation.add(handleCorrect, this, 0, this.game)
    }

    this.game.vars = {
      godMode: config.godMode,
      speed: config.initialSpeed,
      gravity: config.gravity,
      player: {
        position: config.player.startPosition,
        jumpSpeed: config.player.jumpSpeed
      },
      sounds: {
        jump: {
          volume: 0.3,
          loop: false
        },
        background: {
          volume: 0.4,
          loop: true
        },
        attack: {
          volume: 0.3,
          loop: false
        }
      }
    }

    this.fontsReady = false
    this.fontsLoaded = this.fontsLoaded.bind(this)
  }

  preload () {
    WebFont.load({
      google: {
        families: ['Bangers']
      },
      active: this.fontsLoaded
    })

    let text = this.add.text(this.world.centerX, this.world.centerY, 'loading fonts', { font: '16px Arial', fill: '#dddddd', align: 'center' })
    text.anchor.setTo(0.5, 0.5)

    this.load.image('loaderBg', './assets/images/loader-bg.png')
    this.load.image('loaderBar', './assets/images/loader-bar.png')
  }

  create () {
    this.game.controller = new Controller(this.game)

    // Отключаем сброс ввода для того, чтобы он
    // не ломался при переходе между стейтами
    this.game.input.resetLocked = true

    this.game.physics.startSystem(Phaser.Physics.ARCADE)
    this.game.physics.arcade.gravity.y = config.gravity.y
  }

  render () {
    if (this.fontsReady) {
      this.state.start('Splash')
    }
  }

  fontsLoaded () {
    this.fontsReady = true
  }
}
