import Phaser from 'phaser'

import config from '../config'
import signals from '../signals'

// Terrain objects
import Swamp from '../sprites/Swamp'
import Ground from '../sprites/Ground'

const _terrainTypes = Object.keys(config.terrain)
const _floorTypes = { Ground, Swamp }
const _counters = {
  row: { 'Ground': 0 },
  between: { 'Ground': 0, 'Swamp': 0 },
  last: 'Ground',
  terrainLength: 0
}

let _hold = 0

// Bottom game layer which consists of grounds, swamps, waters and etc.
// This layer always have body and enabled physics
let _floor

// Terrain types roll which is using on updates and terrain changes
let _current

const last = group => group.getAt(_floor.children.length - 1)
const lastRight = group => last(group) === -1 ? 0 : last(group).right
const lastHeight = group => last(group).height / config.tileSize || 1

const addFloor = e => { _floor.add(e) }

export default class {
  constructor (game, starting) {
    this.game = game

    // init terrain objects
    _floor = this.game.add.group()
    _current = starting
    this.init()

    signals.terrainChanged.add(terrain => { _current = terrain.type }, this)
    signals.floorHold.add(tilesCount => { _hold = tilesCount }, this)
  }

  init () {
    while (lastRight(_floor) - this.game.world.width < config.tileSize * 2) {
      addFloor(new Ground({ game: this.game, type: 'middle', x: lastRight(_floor), height: 1 }))
    }
  }

  getAt (index) {
    return _floor.getAt(index)
  }

  update () {
    const firstFloor = _floor.getAt(0)
    if (!firstFloor.inCamera) _floor.remove(firstFloor)

    while (lastRight(_floor) - (this.game.camera.x + this.game.camera.view.width) < config.tileSize * 2) {
      this.generate(_terrainTypes[_current])

      signals.terrainCreated.dispatch(last(_floor), _current)

      _counters.terrainLength++
    }

    return _counters.terrainLength
  }

  change (next) {
    if (_terrainTypes[next] === undefined) {
      throw new Error('undefined terrain type')
    }

    _current = next
    _counters.terrainLength = 0
  }

  next () {
    if (_hold > 0) {
      _hold = 0
      return _counters.last
    }

    const floorConfig = config.terrain[_current].floor
    let nextFloorType = floorConfig.default

    for (const possFloorType in floorConfig) {
      const possFloorConfig = floorConfig[possFloorType]

      // Check floor probability
      if (possFloorConfig.p === undefined || !Phaser.Utils.chanceRoll(possFloorConfig.p)) continue

      // Check floor inRow rule
      if (possFloorConfig.inRow !== undefined) {
        if (_counters.row[possFloorType] >= possFloorConfig.inRow.max) continue
      }

      // Check floor beetween rule
      if (possFloorConfig.between !== undefined) {
        if (_counters.between[possFloorType] <= possFloorConfig.between.min) continue
        if (_counters.between[possFloorType] >= possFloorConfig.between.max) continue
      }

      nextFloorType = possFloorType
      break
    }

    return nextFloorType
  }

  generate (terrain) {
    let nextFloorType = this.next()

    if (_counters.row[nextFloorType] === undefined) _counters.row = { [nextFloorType]: 0 }
    _counters.row[nextFloorType]++

    for (const btwName in _counters.between) {
      _counters.between[btwName] = btwName === nextFloorType ? 0 : _counters.between[btwName] + 1
    }

    if (_counters.last === nextFloorType) {
      addFloor(new _floorTypes[nextFloorType]({ game: this.game, type: 'middle', x: lastRight(_floor), height: 1 }))
    } else {
      _floor.remove(last(_floor))
      addFloor(new _floorTypes[_counters.last]({ game: this.game, type: 'right', x: lastRight(_floor), height: 1 }))
      addFloor(new _floorTypes[nextFloorType]({ game: this.game, type: 'left', x: lastRight(_floor), height: 1 }))
    }

    _counters.last = nextFloorType
  }

  collide (obj, ...args) {
    return this.game.physics.arcade.collide(obj, _floor, ...args)
  }

  reset () {
    _floor.removeAll(true, true)

    _hold = 0

    _counters.row = { 'Ground': 0 }
    _counters.between = { 'Ground': 0, 'Swamp': 0 }
    _counters.last = 'Ground'
    _counters.terrainLength = 0

    this.init()
  }
}
