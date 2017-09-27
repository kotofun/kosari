import TerrainFactory from '../../components/TerrainFactory'

import { terrainTypes } from '../../consts'

import { rnd } from '../../utils'

var ctx

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
    this.game = ctx.game

    this.game.physics.arcade.enable(this)

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

  collide (obj) {
    return this.game.physics.arcade.collide(obj, this.floor)
  }
}
