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

    signals.terrainCreated.add(this.update, this)
  }

  next (terrain = Phaser.ArrayUtils.getRandomItem(_terrainTypes)) {
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
}
