import { rnd } from '../../utils'

import config from '../../config'

import Ground from '../../sprites/Ground'
import Swamp from '../../sprites/Swamp'

import Grass from '../../sprites/Grass'

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

var SurfaceTypes = { Swamp, Ground }

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

    this._init()
  }

  _init () {
    const width = this.game.width
    const tilesCount = Math.ceil(width / config.tileSize) + 1

    for (let i = 0; i < tilesCount; i++) {
      const ground = new Ground({
        game: this.game,
        speed: -ctx.speed,
        type: 'middle',
        x: config.tileSize * i
      })
      this.surface.add(ground)

      const grass = new Grass({
        game: this.game,
        x: config.tileSize * i,
        y: ground.y - config.tileSize,
        speed: -ctx.speed
      })
      this.objects.add(grass)
    }

    this.next()
  }

  next () {
    const surfaceObj = new SurfaceTypes[surfaceRoll.current.class]({
      game: this.game,
      height: surfaceRoll.current.height,
      speed: -ctx.speed,
      type: getSurfaceType()
    })
    this.surface.add(surfaceObj)

    if (surfaceRoll.current.class === 'Ground') {
      this.objects.add(new Grass({
        game: this.game,
        x: this.game.world.width,
        y: surfaceObj.y - config.tileSize,
        speed: -ctx.speed
      }))
    }

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
