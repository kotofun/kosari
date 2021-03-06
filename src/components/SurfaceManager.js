import Phaser from 'phaser'

import config from '../config'
import signals from '../signals'

import Grass from '../sprites/Grass'
import Player from '../sprites/Player'
import Chaser from '../sprites/Chaser'

let _grass

const _createSwap = game => {
  const maxGrass = config.gameWidth / config.tileSize + 5
  for (let i = 0; i < maxGrass; i++) {
    _grass.add(new Grass(game))
  }
}

export default class {
  constructor (game) {
    this.game = game

    _grass = this.game.add.group()

    _createSwap(game)

    signals.terrainCreated.add(this.revive, this)
    signals.mow.add(this.mow, this)

    this.init()
  }

  init () {
    for (let i = 0; i * config.tileSize - this.game.world.width < config.tileSize * 2; i++) {
      let grass = _grass.getFirstDead()
      grass.reset(i * config.tileSize, this.game.world.height - config.tileSize)
    }
  }

  update () {
    _grass.forEachAlive(grass => {
      if (grass.right < this.game.camera.view.x) grass.kill()
    })
  }

  revive (floor) {
    if (!floor.standable) return

    const grass = _grass.getFirstDead()

    if (grass === null) return

    grass.reset(floor.left, floor.top)
  }

  mow (mower) {
    if (mower.isOnFloor()) {
      _grass.forEachAlive(grass => {
        if (Phaser.Rectangle.intersects(grass.getBounds(), mower.getBounds())) {
          if (grass.health) {
            if (mower instanceof Player) this.game.stats.mowedGrass.Player++
            if (mower instanceof Chaser) this.game.stats.mowedGrass.Chaser++
            grass.damage()
          }
        }
      })
    }
  }

  reset () {
    _grass.forEachAlive(grass => { grass.kill() })
    this.init()
  }
}
