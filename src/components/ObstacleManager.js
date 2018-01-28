import Phaser from 'phaser'

import config from '../config'
import signals from '../signals'

import DisplayObjectPool from '../pool/DisplayObjectPool'
import PoolManager from '../pool/PoolManager'

import Grave from '../sprites/Grave'

const _constructors = { Grave }

let _prevObstacle = null

export default class {
  constructor (game) {
    this.game = game
    this._obstacles = this.game.add.group()

    this._poolManager = new PoolManager(this.game, DisplayObjectPool)
    for (let obstacleType in _constructors) {
      this._poolManager.create(_constructors[obstacleType], obstacleType)
    }

    signals.terrainCreated.add(this.generate, this)
  }

  generate (floor, terrainType) {
    const obstaclesConfig = config.terrain[terrainType].obstacles
    if (obstaclesConfig === undefined) return

    if (!floor.standable) return
    if (_prevObstacle !== null && _prevObstacle.right > floor.left) return

    for (const obstacleType in obstaclesConfig) {
      if (Phaser.Utils.chanceRoll(obstaclesConfig[obstacleType].p)) {
        // check if this obstacle has a property between
        if (obstaclesConfig[obstacleType].between !== undefined && _prevObstacle !== null) {
          // gap between new obstacle and previous in tiles
          const between = Math.ceil((floor.left - _prevObstacle.right) / config.tileSize)

          if (between <= obstaclesConfig[obstacleType].between.min) continue
        }

        const obstacle = this._poolManager.getPoolFor(obstacleType).get()
        this._obstacles.add(obstacle)
        obstacle.reset(floor.left, floor.top - config.tileSize)

        _prevObstacle = obstacle

        if (obstacle.width > config.tileSize) signals.floorHold.dispatch(Math.ceil(obstacle.width / config.tileSize) - 1)
      }
    }
  }

  update () {
    this._obstacles.forEachAlive(obstacle => {
      if (obstacle.right < this.game.camera.view.x) {
        this._obstacles.remove(obstacle)
        this._poolManager.getPoolFor(obstacle).kill(obstacle)
      }
    })
  }

  collide (obj, ...args) {
    return this.game.physics.arcade.collide(obj, this._obstacles, ...args)
  }

  reset () {
    this._poolManager.clear()
    this._obstacles.removeAll()

    _prevObstacle = null
  }
}
