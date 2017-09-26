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

const getLastX = () => {
  if (_floor.children.length === 0) {
    return 0
  }

  return _floor.getAt(_floor.children.length - 1).right
}

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

  initial () {
    this.plateau({
      count: Math.ceil(this.game.width / config.tileSize) + 1
    })
  }

  plateau ({ count = 1, height = 1, withEdges = false }) {
    for (let i = 0; i < count; i++) {
      let type = 'middle'

      if (withEdges) {
        switch (i) {
          case 0: { type = 'left'; break }
          case count - 1: { type = 'right'; break }
          default: { type = 'middle'; break }
        }
      }

      _floor.add(new Ground({
        game: this.game,
        type,
        x: getLastX(),
        height: height
      }))
    }

    return _floor
  }
}
