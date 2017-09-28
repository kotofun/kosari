let ctx

export default class {
  constructor (context, layers = []) {
    ctx = context
    this.game = ctx.game

    this.layers = []

    this.stopped = false

    layers.map(v => this.add(v))
  }

  stopAnimation () {
    for (var i = 0; i < this.layers.length; i++) {
      this.layers[i].autoScroll(0, 0)
    }

    this.stopped = true
  }

  startAnimation () {
    this.stopped = false
    this.update()
  }

  update () {
    if (this.stopped) return

    for (var i = 0; i < this.layers.length; i++) {
      this.layers[i].autoScroll(-(this.game.vars.speed / 5) * (i + 1), 0)
    }
  }

  add (layer) {
    layer.fixedToCamera = true
    this.layers.push(layer)
  }
}
