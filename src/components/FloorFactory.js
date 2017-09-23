import config from '../config'

import Swamp from '../sprites/Swamp'
import Ground from '../sprites/Ground'

let FloorTypes = { Swamp, Ground }

let ctx

export default class {
  constructor (context) {
    ctx = context

    this.game = ctx.game
  }

  make ({ cls, type, x, count = 1, height = 1 }) {
    let floorPieces = []

    for (let i = 0; i < count; i++) {
      floorPieces.push(new FloorTypes[cls]({
        game: this.game,
        type: 'middle',
        x: x + config.tileSize * i,
        height: height
      }))
    }

    return floorPieces
  }
}
