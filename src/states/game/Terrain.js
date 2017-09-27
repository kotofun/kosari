import TerrainFactory from '../../components/TerrainFactory'

import { terrainTypes } from '../../consts'

import { rnd } from '../../utils'

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

  collideSurface (obj) {
    return game.physics.arcade.collide(obj, this.surface)
  }
}
