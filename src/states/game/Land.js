import { rnd } from '../../utils'
import Ground from '../../sprites/Ground'
import Swamp from '../../sprites/Swamp'

var lastGap = 0

var surfaceRoll = {
  prev: 'none',
  current: 'Ground',
  next: 'Ground'
}

var SurfaceTypes = { Swamp, Ground }

function updateSurfaceState () {
  surfaceRoll.prev = surfaceRoll.current
  surfaceRoll.current = surfaceRoll.next
  surfaceRoll.next = rnd(1, 10) > 3 ? 'Ground' : 'Swamp'
}

function getSurfaceType () {
  if (surfaceRoll.prev === surfaceRoll.current) {
    if (surfaceRoll.current === surfaceRoll.next) {
      return 'middle'
    } else {
      return 'right'
    }
  } else {
    return 'left'
  }
}

export default class {
  constructor (context) {
    this.game = context.game

    this.land = this.game.add.group()

    this.next()
  }

  next () {
    let type = getSurfaceType()
    let piece = new SurfaceTypes[surfaceRoll.current]({ game: this.game, type })

    piece.speed = -100
    this.land.add(piece)

    updateSurfaceState()
  }

  update () {
    this.land.forEachAlive(this.updateGround, this)

    let lastGround = this.land.getAt(this.land.children.length - 1)
    if ((this.game.world.bounds.right - lastGround.right) >= lastGap - 3) {
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
