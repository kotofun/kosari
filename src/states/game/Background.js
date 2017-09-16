var ctx

var forest
var trees
var grass
var clouds

export default class {
  constructor (context) {
    ctx = context
    this.game = context.game

    forest = this.game.add.tileSprite(0, this.game.height - 192, this.game.width, 128, 'bg-forest')
    trees = this.game.add.tileSprite(0, this.game.height - 200, this.game.width, 169, 'bg-trees')
    grass = this.game.add.tileSprite(0, this.game.height - 94, this.game.width, 94, 'bg-grass')
    clouds = this.game.add.tileSprite(0, 0, this.game.width, 64, 'bg-clouds')
  }

  startAnimation () {
    forest.autoScroll(-25, 0)
    trees.autoScroll(-50, 0)
    grass.autoScroll(-75, 0)
    clouds.autoScroll(-100, 0)
  }

  stopAnimation () {
    forest.autoScroll(0, 0)
    trees.autoScroll(0, 0)
    grass.autoScroll(0, 0)
    clouds.autoScroll(0, 0)
  }
}
