import config from '../config'

import Swamp from '../sprites/Swamp'
import Ground from '../sprites/Ground'

let SurfaceTypes = { Swamp, Ground }

let ctx

export default class {
  constructor (context) {
    ctx = context

    this.game = ctx.game
  }

  make ({ cls, type, count = 1, height = 1, x = this.game.width }) {
    let surface = []

    for (let i = 0; i < count; i++) {
      surface.push(new SurfaceTypes[cls]({
        game: this.game,
        type: 'middle',
        x: x + config.tileSize * i,
        height: height
      }))
    }

    return surface
  }
}
