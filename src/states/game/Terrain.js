import Phaser from 'phaser'

import TerrainFactory from '../../components/TerrainFactory'
import Grass from '../../sprites/Grass'

import { terrainTypes } from '../../consts'
import config from '../../config'

import { rnd } from '../../utils'

let ctx

let game

let _roll = [
  { type: terrainTypes.relax, length: config.terrain.relax.length * config.gameWidth / config.tileSize },
  { type: terrainTypes.plateau, length: config.gameWidth / config.tileSize * 3 },
  { type: terrainTypes.habitual, length: config.gameWidth / config.tileSize }
]

const nextTerrain = () => {
  const terrainKeys = Object.keys(terrainTypes)

  return {
    type: terrainTypes[terrainKeys[terrainKeys.length * Math.random() << 0]],
    length: rnd(config.gameWidth / config.tileSize / 2, config.gameWidth / config.tileSize)
  }
}

export default class {
  constructor (context) {
    ctx = context
    game = ctx.game

    game.physics.arcade.enable(this)

    this.terrain = new TerrainFactory(ctx, this)

    this.terrain.init()
  }

  get current () {
    return _roll[0]
  }

  update () {
    if (this.terrain.update() >= _roll[0].length) {
      _roll.shift()
      this.terrain.change(_roll[0].type)
      _roll.push(nextTerrain())
    }
  }

  collideFloor (obj, ...args) {
    return game.physics.arcade.collide(obj, this.floor, ...args)
  }

  collideObstacles (obj, ...args) {
    return game.physics.arcade.collide(obj, this.obstacles, ...args)
  }

  mowGrass (mower) {
    if (mower.isOnFloor()) {
      this.grass.children.filter(elem => {
        if (!(elem instanceof Grass)) return false

        return Phaser.Rectangle.intersects(elem.getBounds(), mower.getBounds())
      }).map(e => this.grass.remove(e))
    }
  }
}
