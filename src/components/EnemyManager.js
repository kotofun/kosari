import Phaser from 'phaser'

import config from '../config'
import signals from '../signals'

import Skeleton from '../sprites/Skeleton'
import Bat from '../sprites/Bat'

const enemyTypes = { Bat, Skeleton }

// controller context
let ctx

// global game reference
let game

// enemy swap
const _enemies = {}

// terrain instance
let _terrain

const _init = () => {
  const defaultMaxEnemiesCount = config.enemies.max ? config.enemies.max : 10

  for (const enemyType in enemyTypes) {
    const maxEnemiesCount = config.enemies[enemyType] ? config.enemies[enemyType] : defaultMaxEnemiesCount

    _enemies[enemyType] = game.add.group()
    for (let i = 0; i < maxEnemiesCount; i++) _enemies[enemyType].add(new enemyTypes[enemyType](game))
  }
}

const _updateAlive = (enemy) => {
  if (enemy.right < game.camera.view.x) enemy.kill()
}

const _revive = (floor) => {
  const enemiesConfig = config.terrain[_terrain.current.type].enemies
  if (enemiesConfig === undefined) return

  for (const enemyType in enemiesConfig) {
    if (!floor.standable) continue
    if (!Phaser.Utils.chanceRoll(enemiesConfig[enemyType].p)) continue

    const enemy = _enemies[enemyType].getFirstDead()
    if (enemy === null) continue

    enemy.reset(floor.left, game.world.height - floor.height - enemy.height)
    break
  }
}

export default class {
  constructor (context, terrain) {
    ctx = context
    game = ctx.game

    _terrain = terrain

    signals.mow.add(this.attack, this)

    signals.terrainCreated.add(_revive, this)

    _init()
  }

  collide (obj, ...args) {
    let collided = false
    for (const enemyType in _enemies) {
      collided |= game.physics.arcade.collide(obj, _enemies[enemyType], ...args)
    }

    return collided
  }

  update () {
    for (const enemyType in _enemies) {
      _enemies[enemyType].forEachAlive(_updateAlive)
    }
  }

  attack (attacker) {
    for (const enemyType in _enemies) {
      _enemies[enemyType].forEachAlive(enemy => {
        if (Phaser.Rectangle.intersects(attacker.getBounds(), enemy.getBounds())) enemy.kill()
      })
    }
  }

  reset () {
    for (const enemyType in _enemies) {
      _enemies[enemyType].forEachAlive(enemy => { enemy.kill() })
    }
  }
}
