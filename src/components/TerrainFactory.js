import Phaser from 'phaser'

import config from '../config'

import { terrainTypes } from '../consts'

import signals from '../signals'

// Terrain objects
import Swamp from '../sprites/Swamp'
import Ground from '../sprites/Ground'

const _floorTypes = { Ground, Swamp }

const _counters = {
  row: { 'Ground': 0 },
  between: { 'Ground': 0, 'Swamp': 0 },
  last: 'Ground',
  terrainLength: 0
}

// Game state context reference
let ctx

// Game reference
let game

// Reference to a parent class for binding terrain group vars
let parent

// Bottom game layer which consists of grounds, swamps, waters and etc.
// This layer always have body and enabled physics 
let _floor

// Terrain types roll which is using on updates and terrain changes
let _current

const last = group => group.getAt(_floor.children.length - 1)
const lastRight = group => last(group) === -1 ? 0 : last(group).right
const lastHeight = group => last(group).height / config.tileSize || 1

const addFloor = e => {
  _floor.add(e)
}

export default class {
  constructor (context, _parent, starting = config.terrain.relax) {
    ctx = context
    parent = _parent

    this.game = ctx.game
    game = ctx.game

    // init terrain objects
    _floor = game.add.group()

    // bind terrain objects to parent
    parent.floor = _floor

    _current = starting
  }

  get current () {
    return _current
  }

  update () {
    const firstFloor = _floor.getAt(0)
    if (!firstFloor.inCamera) _floor.remove(firstFloor)

    while (lastRight(_floor) - (this.game.camera.view.x + this.game.camera.view.width) < config.tileSize * 2) {
      this.generate(terrainTypes[_current])

      signals.terrainCreated.dispatch(last(_floor), _current)

      _counters.terrainLength++
    }

    return _counters.terrainLength
  }

  change (next) {
    if (terrainTypes[next] === undefined) {
      throw new Error('undefined terrain type')
    }

    _current = next
    _counters.terrainLength = 0
  }

  generate (terrain) {
    const floorConfig = config.terrain[_current].floor
    let nextFloorName = floorConfig.default
    let nextFloor = {
      [nextFloorName]: floorConfig[floorConfig.default]
    }

    for (const floorType in floorConfig) {
      const probability = floorConfig[floorType].p
      if (probability === undefined) continue
      if (!Phaser.Utils.chanceRoll(probability)) continue

      if (floorConfig[floorType].between !== undefined) {
        if (_counters.between[floorType] < floorConfig[floorType].between.min) continue
        if (_counters.between[floorType] >= floorConfig[floorType].between.max) continue
      }

      nextFloor = { [floorType]: floorConfig[floorType] }
      nextFloorName = floorType
      break
    }

    if (_counters.row[nextFloorName] === undefined) _counters.row = { [nextFloorName]: 0 }
    _counters.row[nextFloorName]++

    for (const btwName in _counters.between) {
      _counters.between[btwName] = btwName === nextFloorName ? 0 : _counters.between[btwName] + 1
    }

    if (_counters.last === nextFloorName) {
      addFloor(new _floorTypes[nextFloorName]({ game, type: 'middle', x: lastRight(_floor), height: 1 }))
    } else {
      _floor.remove(last(_floor))
      addFloor(new _floorTypes[_counters.last]({ game, type: 'right', x: lastRight(_floor), height: 1 }))
      addFloor(new _floorTypes[nextFloorName]({ game, type: 'left', x: lastRight(_floor), height: 1 }))
    }

    _counters.last = nextFloorName
  }
}
