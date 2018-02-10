import signals from '../signals'

import config from '../config'

export default class {
  constructor (game) {
    this.game = game

    this.layers = [
      this.game.add.tileSprite(0, -128, this.game.width, 512, 'bg', 'sky'),
      this.game.add.tileSprite(0, 0, this.game.width, 275, 'bg', 'clouds'),
      this.game.add.tileSprite(0, this.game.height - 225, this.game.width, 225, 'bg', 'forest'),
      this.game.add.tileSprite(0, this.game.height - 253, this.game.width, 253, 'bg', 'cemetery'),
      this.game.add.tileSprite(0, this.game.height - 86, this.game.width, 86, 'bg', 'grass')
    ]

    const today = new Date()
    if (today.getUTCMonth() >= 10 || today.getUTCMonth() < 2) {
      // Новогодний снег
      this.snowflakes = this.game.add.tileSprite(0, 0, this.game.width, this.game.height, 'snowflakes')

      // Добавляем в слои бэкграунда самым последним
      this.layers.push(this.snowflakes)

      // Добавляем анимацию снегопада
      this.snowflakes.animations.add('falling')
      this.snowflakes.animations.play('falling', 15, true)
    }

    // Bind bg layers to camera
    this.layers.map(l => { l.fixedToCamera = true })

    signals.speedDown.add(this.stopAnimation, this)
    // signals.speedUp.add(this.startAnimation, this)
    signals.speedReset.add(this.startAnimation, this)
    signals.speedUpdate.add(this.startAnimation, this)

    signals.onGameStart.add(this.startAnimation, this)
    signals.onGameOver.add(this.stopAnimation, this)

    signals.onGameResume.add(this.startAnimation, this)
    signals.onGamePause.add(this.stopAnimation, this)
  }

  stopAnimation () {
    for (var i = 0; i < this.layers.length; i++) {
      this.layers[i].autoScroll(0, 0)
    }
  }

  startAnimation (speed) {
    for (var i = 0; i < this.layers.length; i++) {
      speed = speed || (this.game.vars.speed / 5)
      this.layers[i].autoScroll(-(speed) * (i + 1), 0)
    }
  }

  reset () {
    this.stopAnimation()
    this.layers.map(l => { l.reset() })
  }
}
