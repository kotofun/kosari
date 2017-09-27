import TerrainFactory from '../../components/TerrainFactory'

import { terrainTypes } from '../../consts'

var ctx

export default class {
  constructor (context) {
    ctx = context
    this.game = ctx.game

    this.game.physics.arcade.enable(this)

    this.terrain = new TerrainFactory(ctx, this)

    this.terrain.init()
  }

  update () {
    this.terrain.update()
  }

  collide (obj) {
    return this.game.physics.arcade.collide(obj, this.floor)
  }
}
