import signals from '../signals'

// controller context
let ctx

// global game reference
let game

export default class {
  constructor (context) {
    ctx = context
    game = ctx.game

    this.layers = [
      game.add.tileSprite(0, -192, game.width, 512, 'bg', 'sky'),
      game.add.tileSprite(0, 0, game.width, 275, 'bg', 'clouds'),
      game.add.tileSprite(0, game.height - 225, game.width, 225, 'bg', 'forest'),
      game.add.tileSprite(0, game.height - 253, game.width, 253, 'bg', 'cemetery'),
      game.add.tileSprite(0, game.height - 86, game.width, 86, 'bg', 'grass')
    ]
    // Bind bg layers to camera
    this.layers.map(l => { l.fixedToCamera = true })

    signals.speedDown.add(this.stopAnimation, this)
  }

  stopAnimation () {
    for (var i = 0; i < this.layers.length; i++) {
      this.layers[i].autoScroll(0, 0)
    }
  }

  update () {
    for (var i = 0; i < this.layers.length; i++) {
      this.layers[i].autoScroll(-(game.vars.speed / 5) * (i + 1), 0)
    }
  }
}
