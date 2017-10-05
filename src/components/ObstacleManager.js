import Phaser from 'phaser'

import config from '../config'
import signals from '../signals'

import Grave from '../sprites/Grave'

const _obstacleTypes = { Grave }
const _obstacles = {}

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

    for (const obstacleType in obstaclesConfig) {
      if (Phaser.Utils.chanceRoll(obstaclesConfig[obstacleType].p)) {
        const obstacle = _obstacles[obstacleType].getFirstDead()

        if (obstacle === null) return

        obstacle.reset(floor.left, floor.top - config.tileSize)
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
}
