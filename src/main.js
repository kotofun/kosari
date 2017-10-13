import 'pixi'
import 'p2'
import Phaser from 'phaser'
import FastClick from 'fastclick'

import BootState from './states/Boot'
import SplashState from './states/Splash'
import MenuState from './states/Menu'
import GameState from './states/Game'

import config from './config'

class Game extends Phaser.Game {
  constructor () {
    const docElement = document.documentElement

    // Enable fastclick for mobile taps
    FastClick.attach(document.body)

    // Desktop
    const width = config.gameWidth
    const height = config.gameHeight

    super(width, height, Phaser.CANVAS, 'content', null, false, false)

    this.scaleFactor = Math.min(
      Math.floor(Math.max(1, docElement.clientWidth / config.gameWidth)),
      Math.floor(Math.max(1, docElement.clientHeight / config.gameHeight))
    )

    this.state.add('Boot', BootState, false)
    this.state.add('Splash', SplashState, false)
    this.state.add('Menu', MenuState, false)
    this.state.add('Game', GameState, false)

    this.state.start('Boot')
  }
}

window.game = new Game()
