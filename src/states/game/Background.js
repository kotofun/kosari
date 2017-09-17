var ctx

export default class {
  constructor (context, layers = []) {
    ctx = context
    this.game = context.game

    this.layers = layers
  }

  startAnimation () {
    for (var i = 0; i < this.layers.length; i++) {
      this.layers[i].autoScroll(-25 * (i + 1), 0)
    }
  }

  stopAnimation () {
    for (var i = 0; i < this.layers.length; i++) {
      this.layers[i].autoScroll(0, 0)
    }
  }

  add (layer) {
    this.layers.push(layer)
  }
}
