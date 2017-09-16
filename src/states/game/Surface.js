import { rnd } from '../../utils'

import Config from '../../config'

import Ground from '../../sprites/Ground'
import Swamp from '../../sprites/Swamp'

// TODO: add generation:
//    - grass
//    - tombstone

var ctx

var surfaceRoll = {
  prev: 'none',
  current: {
    class: 'Ground',
    height: 1
  },
  next: {
    class: 'Ground',
    height: 1
  }
}

var SurfaceTypes = { Swamp, Ground }

function nextSurfaceType (current) {
  return rnd(1, 10) > 2 ? 'Ground' : 'Swamp'
}

function nextSurfaceHeight (current, nextClass) {
  if (current.class === nextClass) {
    return current.height
  } else if (nextClass === 'Ground') {
    return rnd(Config.ground.height.min, Config.ground.height.max)
  } else {
    return 1
  }
}

function updateSurfaceState () {
  surfaceRoll.prev = surfaceRoll.current
  surfaceRoll.current = surfaceRoll.next

  let nextClass = nextSurfaceType()
  surfaceRoll.next = {
    class: nextClass,
    height: nextSurfaceHeight(surfaceRoll.current, nextClass)
  }
}

function getSurfaceType () {
  if (surfaceRoll.prev.class === surfaceRoll.current.class) {
    if (surfaceRoll.current.class === surfaceRoll.next.class) {
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
    ctx = context
    this.game = context.game

    this.surface = this.game.add.group()

    this.next()
  }

  next () {
    this.surface.add(new SurfaceTypes[surfaceRoll.current.class]({
      game: this.game,
      height: surfaceRoll.current.height,
      speed: -ctx.speed,
      type: getSurfaceType()
    }))

    updateSurfaceState()
  }

  update () {
    this.surface.forEachAlive(this.updateGround, this)

    let lastGround = this.surface.getAt(this.surface.children.length - 1)
    if ((this.game.world.bounds.right - lastGround.right) >= -3) {
      this.next()
    }
  }

  updateGround (ground) {
    if (ground.right < this.game.world.bounds.left) {
      this.surface.remove(ground, true)
    }
  }

  collide (obj) {
    return this.game.physics.arcade.collide(obj, this.surface)
  }
}
