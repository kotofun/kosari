import Phaser from 'phaser'

import config from '../config'
import signals from '../signals'

import Grave from '../sprites/Grave'

const _obstacleTypes = { Grave }
const _obstacles = {}

let _prevObstacle

const _init = (game) => {
  for (const obstacleType in _obstacleTypes) {
    _obstacles[obstacleType] = game.add.group()
    for (let i = 0; i < config.obstacle[obstacleType].max; i++) {
      _obstacles[obstacleType].add(new _obstacleTypes[obstacleType](game, 0, 0))
    }
  }
}

export default class {
  constructor (game) {
    this.game = game

    _init(this.game)

    signals.terrainCreated.add(this.generate, this)
  }

  generate (floor, terrainType) {
    const obstaclesConfig = config.terrain[terrainType].obstacles
    if (obstaclesConfig === undefined) return

    if (!floor.standable) return
    if (_prevObstacle !== undefined && _prevObstacle.right > floor.left) return

    for (const obstacleType in obstaclesConfig) {
      if (Phaser.Utils.chanceRoll(obstaclesConfig[obstacleType].p)) {
        const obstacle = _obstacles[obstacleType].getFirstDead()

        if (obstacle === null) return

        // check if this obstacle has a property between
        if (obstaclesConfig[obstacleType].between !== undefined && _prevObstacle !== undefined) {
          // gap between new obstacle and previous in tiles
          const between = Math.ceil((floor.left - _prevObstacle.right) / config.tileSize)

          if (between <= obstaclesConfig[obstacleType].between.min) continue
        }

        // positioning a new obstacle
        obstacle.reset(floor.left, floor.top - config.tileSize)

        _prevObstacle = obstacle

        if (obstacle.width > config.tileSize) signals.floorHold.dispatch(Math.ceil(obstacle.width / config.tileSize) - 1)
      }
    }
  }

  update () {
    for (const obstacleType in _obstacles) {
      _obstacles[obstacleType].forEachAlive(obstacle => {
        if (obstacle.right < this.game.camera.view.x) obstacle.kill()
      })
    }
  }

  collide (obj, ...args) {
    let collided = false
    for (const obstacleType in _obstacles) {
      collided |= this.game.physics.arcade.collide(obj, _obstacles[obstacleType], ...args)
    }

    return collided
  }

  reset () {
    for (const obstacleType in _obstacles) {
      _obstacles[obstacleType].forEachAlive(obstacle => { obstacle.kill() })
    }
  }
}
