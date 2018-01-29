import Phaser from 'phaser'

import config from '../config'
import signals from '../signals'

import DisplayObjectPool from '../pool/DisplayObjectPool'
import PoolManager from '../pool/PoolManager'

import Skeleton from '../sprites/Skeleton'
import Bat from '../sprites/Bat'

const _constructors = { Bat, Skeleton }

export default class {
  constructor (context, terrain) {
    this.game = context.game
    this._terrain = terrain
    this._enemies = this.game.add.group()

    signals.mow.add(this.attack, this)
    signals.terrainCreated.add(this._revive, this)

    this._poolManager = new PoolManager(this.game, DisplayObjectPool)
    for (let enemyType in _constructors) {
      this._poolManager.create(_constructors[enemyType], enemyType)
    }
  }

  _revive (floor) {
    const enemiesConfig = config.terrain[this._terrain.current.type].enemies
    if (enemiesConfig === undefined) return

    for (const enemyType in enemiesConfig) {
      if (!floor.standable) continue
      if (!Phaser.Utils.chanceRoll(enemiesConfig[enemyType].p)) continue

      const enemy = this._poolManager.getPoolFor(enemyType).get()
      this._enemies.add(enemy)

      enemy.reset(floor.left, this.game.world.height - floor.height - enemy.height)
      break
    }
  }

  collide (obj, ...args) {
    return this.game.physics.arcade.collide(obj, this._enemies, ...args)
  }

  update () {
    this._enemies.forEachAlive(enemy => {
      if (enemy.right < this.game.camera.view.x) enemy.kill()
    })
  }

  attack (attacker) {
    this._enemies.forEachAlive(enemy => {
      if (Phaser.Rectangle.intersects(attacker.getBounds(), enemy.getBounds())) {
        let pool = this._poolManager.getPoolFor(enemy)
        this._enemies.remove(enemy)
        pool.kill(enemy)
      }
    })
  }

  reset () {
    this._poolManager.clear()
    this._enemies.removeAll()
  }
}
