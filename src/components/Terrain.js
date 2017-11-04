import Phaser from 'phaser'

import config from '../config'
import signals from '../signals'

const _terrainsConfig = config.terrain
const _terrainTypes = Object.keys(_terrainsConfig)

export default class {
  constructor (game, starting) {
    if (starting === undefined) throw new TypeError('Starting terrain can\'t be undefined')

    this.game = game
    this.current = this.next(starting)
    this.startTerrainType = starting

    signals.terrainCreated.add(this.update, this)
  }

  next (terrain) {
    // Get random terrain by it's probabilities
    if (terrain === undefined) {
      let possibleTerrains = []
      // Check chances of each terrainType
      for (let possibleTerrain in _terrainsConfig) {
        // if there is no probability config for terrain then skip it
        if (_terrainsConfig[possibleTerrain].p === undefined) continue
        // Push terrain in possible terrains array if chance passed
        if (Phaser.Utils.chanceRoll(_terrainsConfig[possibleTerrain].p)) possibleTerrains.push(possibleTerrain)
      }

      terrain = possibleTerrains.length > 0 // if there were passed chances
        ? Phaser.ArrayUtils.getRandomItem(possibleTerrains) // then select from them
        : Phaser.ArrayUtils.getRandomItem(_terrainTypes) // else select from all available terrains
    }

    const minLength = _terrainsConfig[terrain].length.min
    const maxLength = _terrainsConfig[terrain].length.max
    const length = Phaser.Math.between(minLength, maxLength)

    return {
      type: terrain,
      length,
      left: length
    }
  }

  update (floor) {
    if (this.current.left-- <= 0) {
      this.current = this.next()
      signals.terrainChanged.dispatch(this.current)
    }
  }

  reset () {
    this.current = this.next(this.startTerrainType)
  }
}
