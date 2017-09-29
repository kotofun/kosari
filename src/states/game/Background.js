import signals from '../../signals'

let ctx

export default class {
  constructor (context, layers = []) {
    ctx = context
    this.game = ctx.game

    this.layers = []

    layers.map(v => this.add(v))

    signals.speedDown.add(this.stopAnimation, this)
  }

  stopAnimation () {
    for (var i = 0; i < this.layers.length; i++) {
      this.layers[i].autoScroll(0, 0)
    }
  }

  update () {
    for (var i = 0; i < this.layers.length; i++) {
      this.layers[i].autoScroll(-(this.game.vars.speed / 5) * (i + 1), 0)
    }
  }

  add (layer) {
    layer.fixedToCamera = true
    this.layers.push(layer)
  }
}
