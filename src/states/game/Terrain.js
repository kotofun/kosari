import { rnd } from '../../utils'

import config from '../../config'

import TerrainFactory from '../../components/TerrainFactory'

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

// logic for generation next surface
function nextSurfaceType (current) {
  return 'Ground'
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

    this.create = new TerrainFactory(ctx, this)

    this.create.initial()
  }

  next () {
    this.create.plateau({ height: surfaceRoll.current.height })

    updateSurfaceState()
  }

  update () {
    const firstSurface = this.floor.getAt(0)
    if (!firstSurface.inCamera) {
      this.floor.remove(firstSurface)
    }

    let lastGround = this.floor.getAt(this.floor.children.length - 1)
    if (lastGround.right - (this.game.camera.view.x + this.game.camera.view.width) < -3) {
      this.next()
    }
  }

  collide (obj) {
    return this.game.physics.arcade.collide(obj, this.floor)
  }
}
