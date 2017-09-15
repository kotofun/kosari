import Config from '../../config'
import Ground from '../../sprites/Ground'

var ctx
var game
var grounds

var lastGap = 0

function nextGap () {
  lastGap = Config.tileSize * ctx.game.rnd.integerInRange(Config.gaps.width.min, Config.gaps.width.max)
}

function nextGround () {
  let ground = new Ground({ game })

  grounds.add(ground)

  ground.speed = -100
}

export default {
  init (context) {
    ctx = context
    game = ctx.game

    if (undefined !== game.grounds) {
      grounds = game.grounds
    } else {
      grounds = game.add.group()
    }

    this.next()

    return grounds
  },

  next () {
    nextGap()
    nextGround()
  },

  update () {
    grounds.forEachAlive(this.updateGround, this)

    let lastGround = grounds.getAt(grounds.children.length - 1)
    if ((game.world.bounds.right - lastGround.right) > lastGap) {
      this.next()
    }
  },

  updateGround (ground) {
    if (ground.right < game.world.bounds.left) {
      grounds.remove(ground, true)
    }
  }
}
