import { terrainTypes } from '../consts'
import config from '../config'

import signals from '../signals'

import { rnd } from '../utils'

const _roll = [
  { type: terrainTypes.relax, length: config.terrain.relax.length * config.gameWidth / config.tileSize },
  { type: terrainTypes.plateau, length: config.gameWidth / config.tileSize * 3 },
  { type: terrainTypes.habitual, length: config.gameWidth / config.tileSize }
]

let _currentLength = 0

const nextTerrain = () => {
  const terrainKeys = Object.keys(terrainTypes)

  return {
    type: terrainTypes[terrainKeys[terrainKeys.length * Math.random() << 0]],
    length: rnd(config.gameWidth / config.tileSize / 2, config.gameWidth / config.tileSize)
  }
}

export default class {
  constructor (game) {
    this.game = game

    signals.terrainCreated.add(this.updateRoll, this)
  }

  get current () {
    return _roll[0]
  }

  updateRoll (floor) {
    _currentLength++
    if (_currentLength >= _roll[0].length) {
      _roll.shift()
      signals.terrainChanged.dispatch(_roll[0])
      _roll.push(nextTerrain())

      _currentLength = 0
    }
  }
}
