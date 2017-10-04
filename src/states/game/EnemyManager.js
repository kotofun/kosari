import Phaser from 'phaser'

import config from '../../config'
import signals from '../../signals'

import Skeleton from '../../sprites/Skeleton'
import Bat from '../../sprites/Bat'

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
  for (const enemyType in enemyTypes) {
    _enemies[enemyType] = game.add.group()
    _enemies[enemyType].add(new enemyTypes[enemyType](ctx))
  }
}

const _updateAlive = (enemy) => {
  if (enemy.right < game.camera.view.x) enemy.kill()
}

const _updateDead = () => {
  const enemiesConfig = config.terrain[_terrain.current.type].enemies
  if (enemiesConfig === undefined) return

  for (const enemyType in enemiesConfig) {
    if (!_terrain.lastFloor.standable) continue
    if (!Phaser.Utils.chanceRoll(enemiesConfig[enemyType].p)) continue

    const enemy = _enemies[enemyType].getFirstDead()
    if (enemy === null) continue

    enemy.reset(_terrain.lastFloor.left, game.world.height - _terrain.lastFloor.height - enemy.height)
    break
  }
}

export default class {
  constructor (context, terrain) {
    ctx = context
    game = ctx.game

    _terrain = terrain

    signals.attack.add(this.attack, this)

    _init()
  }

  collide (obj, ...args) {
    game.physics.arcade.collide(obj, _enemies, ...args)
  }

  update () {
    for (const enemyType in _enemies) {
      _enemies[enemyType].forEachAlive(_updateAlive)
    }

    _updateDead()
  }

  attack () {
    for (const enemyType in _enemies) {
      _enemies[enemyType].forEachAlive(enemy => {
        if (Phaser.Rectangle.intersects(ctx.player.getBounds(), enemy.getBounds())) enemy.kill()
      })
    }
  }
}
