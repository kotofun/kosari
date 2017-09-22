import { rnd } from '../../utils'

import config from '../../config'

import SurfaceFactory from '../../components/SurfaceFactory'

// TODO: add generation:
//    - grass
//    - tombstone

var ctx

var surfaceRoll = {
  prev: {
    class: 'Ground',
    height: 1
  },
  current: {
    class: 'Ground',
    height: 1
  },
  next: {
    class: 'Ground',
    height: 1
  }
}

function nextSurfaceType (current) {
  return rnd(1, 10) > 2 ? 'Ground' : 'Swamp'
}

function nextSurfaceHeight (current, nextClass) {
  if (current.class === nextClass) {
    return current.height
  } else if (nextClass === 'Ground') {
    return rnd(config.ground.height.min, config.ground.height.max)
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

    this.game.physics.arcade.enable(this)

    this.surface = this.game.add.group()
    this.objects = this.game.add.group()

    this.factory = new SurfaceFactory(ctx)

    this._init()
  }

  _init () {
    this.factory.make({
      cls: 'Ground',
      type: 'middle',
      count: Math.ceil(this.game.width / config.tileSize) + 1,
      x: 0
    }).map(obj => {
      this.surface.add(obj)
    })

    this.next()
  }

  next () {
    this.factory.make({
      cls: surfaceRoll.current.class,
      height: surfaceRoll.current.height,
      type: getSurfaceType()
    }).map(obj => {
      this.surface.add(obj)
    })

    updateSurfaceState()
  }

  update () {
    this.surface.forEachAlive(this.updateTile, this)
    this.objects.forEachAlive(this.updateTile, this)

    let lastGround = this.surface.getAt(this.surface.children.length - 1)
    if ((this.game.world.bounds.right - lastGround.right) >= -3) {
      this.next()
    }
  }

  updateTile (tile) {
    if (tile.right < this.game.world.bounds.left) {
      tile.parent.remove(tile, true)
    }
  }

  collide (obj) {
    return this.game.physics.arcade.collide(obj, this.surface)
  }
}
