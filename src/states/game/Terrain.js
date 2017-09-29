import Phaser from 'phaser'

import TerrainFactory from '../../components/TerrainFactory'
import Grass from '../../sprites/Grass'

import { terrainTypes } from '../../consts'

import { rnd } from '../../utils'

import signals from '../../signals'

let ctx

let game

let _roll = [
  { type: terrainTypes.plateau, length: 1 },
  { type: terrainTypes.habitual, length: 5 }
]

const nextTerrain = () => {
  const terrainKeys = Object.keys(terrainTypes)

  return {
    type: terrainTypes[terrainKeys[terrainKeys.length * Math.random() << 0]],
    length: rnd(1, 5)
  }
}

export default class {
  constructor (context) {
    ctx = context
    game = ctx.game

    game.physics.arcade.enable(this)

    this.terrain = new TerrainFactory(ctx, this)

    signals.attack.add(this.mowGrass, this)

    this.terrain.init()
  }

  update () {
    if (this.terrain.update() >= _roll[0].length) {
      _roll.shift()
      this.terrain.change(_roll[0].type)
      _roll.push(nextTerrain())
    }
  }

  collideFloor (obj) {
    return game.physics.arcade.collide(obj, this.floor)
  }

  collideSurface (obj, ...args) {
    return game.physics.arcade.collide(obj, this.surface, ...args)
  }

  isTouched (floorType, obj = ctx.Player) {
    if (!obj.body.touching.down) return false

    return this.floor.filter(f => {
      if (!(f instanceof floorType)) return false

      return (f.top === obj.body.bottom) &&
        (
          (f.left >= obj.body.left && f.left < obj.body.right) ||
          (f.right > obj.body.left && f.right <= obj.body.right) ||
          (f.left <= obj.body.left && f.right >= obj.body.right)
        )
    }).list.length > 0
  }

  mowGrass () {
    const player = ctx.Player

    if (player.isOnFloor()) {
      this.surface.children.filter(elem => {
        if (!(elem instanceof Grass)) return false

        return Phaser.Rectangle.intersects(elem.getBounds(), player.getBounds())
      }).map(e => this.surface.remove(e))
    }
  }
}
