import Phaser from 'phaser'

import config from '../config'
import signals from '../signals'

import Grass from '../sprites/Grass'

let _grass

const _init = game => {
  const maxGrass = config.gameWidth / config.tileSize + 5
  for (let i = 0; i < maxGrass; i++) {
    _grass.add(new Grass(game))
  }
}

export default class {
  constructor (game) {
    this.game = game

    _grass = this.game.add.group()

    _init(game)

    signals.terrainCreated.add(this.revive, this)
    signals.mow.add(this.mow, this)
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

    grass.reset(floor.left, floor.top - grass.height)
  }

  mow (mower) {
    if (mower.isOnFloor()) {
      _grass.forEachAlive(grass => {
        if (Phaser.Rectangle.intersects(grass.getBounds(), mower.getBounds())) grass.kill()
      })
    }
  }
}
