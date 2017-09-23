import config from '../config'

import Swamp from '../sprites/Swamp'
import Ground from '../sprites/Ground'

let FloorTypes = { Swamp, Ground }

// Game state context reference
let ctx

// Reference to a parent class for binding terrain group vars
let parent

// Bottom game layer which consists of grounds, swamps, waters and etc.
// This layer always have body and enabled physics 
let _floor

// On-floor surface which consists of grass, thombstones, thombs and etc.
// Objects of this layer don't always have a physical body
let _surface

export default class {
  constructor (context, _parent) {
    ctx = context
    parent = _parent

    this.game = ctx.game

    // init terrain objects
    _floor = this.game.add.group()
    _surface = this.game.add.group()

    // bind terrain objects to parent
    parent.floor = _floor
    parent.surface = _surface
  }

  floor ({ cls, type, x, count = 1, height = 1 }) {
    for (let i = 0; i < count; i++) {
      _floor.add(new FloorTypes[cls]({
        game: this.game,
        type: 'middle',
        x: x + config.tileSize * i,
        height: height
      }))
    }

    return _floor
  }
}
