import 'pixi'
import 'p2'
import Phaser from 'phaser'

import BootState from './states/Boot'
import SplashState from './states/Splash'
import GameState from './states/game'

import config from './config'

class Game extends Phaser.Game {
  constructor () {
    const docElement = document.documentElement

    // Desktop
    const width = docElement.clientWidth > config.gameWidth ? config.gameWidth : docElement.clientWidth
    const height = docElement.clientHeight > config.gameHeight ? config.gameHeight : docElement.clientHeight

    // Fullscreen for mobile
    // const width =  window.innerWidth * window.devicePixelRatio
    // const height = window.innerHeight * window.devicePixelRatio

    super(width, height, Phaser.CANVAS, 'content', null, false, false)

    this.scaleFactor = Math.min(
      Math.floor(Math.max(1, docElement.clientWidth / config.gameWidth)),
      Math.floor(Math.max(1, docElement.clientHeight / config.gameHeight))
    )

    this.state.add('Boot', BootState, false)
    this.state.add('Splash', SplashState, false)
    this.state.add('Game', GameState, false)

    this.state.start('Boot')
  }
}

if (window.innerHeight > window.innerWidth) {
  document.getElementById("rotate").style.display = 'block'
  window.addEventListener("orientationchange", start)
} else {
  start()
}

function start () {
  document.getElementById("rotate").style.display = 'none'
  window.removeEventListener("orientationchange", start)

  window.setTimeout(function () {
    window.game = new Game()
  }, 400)
}
