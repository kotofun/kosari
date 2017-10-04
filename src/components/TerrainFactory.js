import Phaser from 'phaser'

import config from '../config'

import { terrainTypes } from '../consts'

// Terrain objects
import Swamp from '../sprites/Swamp'
import Ground from '../sprites/Ground'

// Surface objects
import Grass from '../sprites/Grass'
import Grave from '../sprites/Grave'

const _floorTypes = { Ground, Swamp }
let _lastRow = { 'Ground': 0 }
const _lastBetween = { 'Ground': 0, 'Swamp': 0 }

// Game state context reference
let ctx

// Game reference
let game

// Reference to a parent class for binding terrain group vars
let parent

// Bottom game layer which consists of grounds, swamps, waters and etc.
// This layer always have body and enabled physics 
let _floor

// On-floor obstacles which consists of thombstones, thombs and etc.
// Objects of this layer always have a physical body
let _obstacles

// Grass group
let _grass

// Terrain types roll which is using on updates and terrain changes
let _current

// Last terrain length after changing
let _lastLength = 0

const getLastFloor = () => { return _floor.getAt(_floor.children.length - 1) }

const getLastRight = () => {
  const floor = getLastFloor()

  if (floor === -1) return 0

  return floor.right
}

const getLastHeight = () => { return getLastFloor().height / config.tileSize || 1 }

// Add ending terrain tile
const _finish = (terrain) => {
  if (terrain === terrainTypes.plateau) {
    addFloor(new Ground({
      game,
      type: 'middle',
      x: getLastRight(),
      height: getLastFloor().height / config.tileSize
    }))
  }
}

// Add starting terrain tile
const _start = (terrain) => {
  if (terrain === terrainTypes.plateau) {
    addFloor(new Ground({
      game,
      type: 'middle',
      x: getLastRight(),
      height: getLastFloor().height / config.tileSize
    }))
  }
}

const _addSurface = (e) => {
  if (!(e instanceof Ground)) return

  // Grass exists always!
  _grass.add(new Grass({ game, x: getLastFloor().left, y: getLastFloor().top - config.tileSize }))

  _addObstacle()
}

const _addObstacle = () => {
  // There is no surfaces in current terrain type
  if (config.terrain[_current].obstacles === undefined) return

  // There are graves in current terrain type
  if (config.terrain[_current].obstacles.grave !== undefined) {
    const gapBetween = config.terrain[_current].obstacles.grave.between.min * config.tileSize
    const lastObstacle = _obstacles.getAt(_obstacles.children.length - 1)

    const isHappened = Phaser.Utils.chanceRoll(config.terrain[_current].obstacles.grave.p)
    const isGrounded = _floor.getAt(_floor.children.length - 2) instanceof Ground
    const isDistanced = _obstacles.children.length === 0 || (getLastFloor().left - lastObstacle.right) >= gapBetween
    if (isHappened && isGrounded && isDistanced) {
      const grave = new Grave({ game, x: getLastFloor().left - config.tileSize, y: getLastFloor().top - config.tileSize })
      _obstacles.add(grave)
    }
  }
}

const addFloor = e => {
  _floor.add(e)
  _addSurface(e)
}

export default class {
  constructor (context, _parent, starting = config.terrain.relax) {
    ctx = context
    parent = _parent

    this.game = ctx.game
    game = ctx.game

    // init terrain objects
    _floor = game.add.group()
    _grass = game.add.group()
    _obstacles = game.add.group()

    // bind terrain objects to parent
    parent.floor = _floor
    parent.obstacles = _obstacles
    parent.grass = _grass

    _current = starting
  }

  get current () {
    return _current
  }

  update () {
    const firstFloor = _floor.getAt(0)
    if (!firstFloor.inCamera) _floor.remove(firstFloor)

    while (getLastRight() - (this.game.camera.view.x + this.game.camera.view.width) < config.tileSize * 2) {
      this.generate(terrainTypes[_current])

      _lastLength++
    }

    const firstObstacle = _obstacles.getAt(0)
    if (firstObstacle.right < game.camera.x) _obstacles.remove(firstObstacle)

    const firstGrass = _grass.getAt(0)
    if (!firstGrass.inCamera) _grass.remove(firstGrass)

    return _lastLength
  }

  change (next) {
    if (terrainTypes[next] === undefined) {
      throw new Error('undefined terrain type')
    }

    _finish(_current)
    _start(next)

    _current = next
    _lastLength = 0
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
        if (_lastBetween[floorType] < floorConfig[floorType].between.min) continue
        if (_lastBetween[floorType] >= floorConfig[floorType].between.max) {
          nextFloor = { [floorType]: floorConfig[floorType] }
          nextFloorName = floorType
          break
        }
      }

      nextFloor = { [floorType]: floorConfig[floorType] }
      nextFloorName = floorType
      break
    }

    if (_lastRow[nextFloorName] === undefined) _lastRow = { [nextFloorName]: 0 }

    _lastRow[nextFloorName]++
    for (const btwName in _lastBetween) {
      _lastBetween[btwName] = btwName === nextFloorName ? 0 : _lastBetween[btwName] + 1
    }

    addFloor(new _floorTypes[nextFloorName]({ game, type: 'middle', x: getLastRight(), height: 1 }))
  }
}
