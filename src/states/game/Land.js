import Config from '../../config'
import Ground from '../../sprites/Ground'

var ctx

var lastGap = 0

function rnd (min, max) {
  return Math.floor(Math.random() * (max - min) + min)
}

function nextGapWidth () {
  lastGap = Config.tileSize * rnd(Config.gaps.width.min, Config.gaps.width.max)
}

function nextGround (game) {
  return new Ground({ game })
}

export default class {
  constructor (context) {
    ctx = context
    this.game = context.game

    this.land = this.game.add.group()

    this.next()
  }

  next () {
    nextGapWidth()

    let ground = nextGround(this.game)
    ground.speed = -100
    this.land.add(ground)
  }

  update () {
    this.land.forEachAlive(this.updateGround, this)

    let lastGround = this.land.getAt(this.land.children.length - 1)
    if ((this.game.world.bounds.right - lastGround.right) > lastGap) {
      this.next()
    }
  }

  updateGround (ground) {
    if (ground.right < this.game.world.bounds.left) {
      this.land.remove(ground, true)
    }
  }

  collide (obj) {
    return this.game.physics.arcade.collide(obj, this.land)
  }
}
