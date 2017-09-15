import Phaser from 'phaser'
import Config from '../config'

function generateBitmap (game) {
  let widthTiles = game.rnd.between(Config.grounds.width.min, Config.grounds.width.max)
  let heightTiles = game.rnd.between(Config.grounds.height.min, Config.grounds.height.max)
  let width = widthTiles * Config.tileSize
  let height = heightTiles * Config.tileSize

  let bmd = game.make.bitmapData(width, height)
  for (let y = 0; y < heightTiles; y++) {
    for (let x = 0; x < widthTiles; x++) {
      let tileSize = Config.tileSize
      let rectX = 0
      let rectY = 0

      // tile in center
      if (x > 0 && x < (widthTiles - 1)) {
        rectX = 1
      // tile in right border side
      } else if (x === (widthTiles - 1)) {
        rectX = 2
      }

      if (y > 0 && y < (heightTiles)) {
        rectY = 1
      }

      let area = new Phaser.Rectangle(rectX * tileSize, rectY * tileSize, tileSize, tileSize)
      bmd.copyRect('land-ground', area, x * tileSize, y * tileSize)
    }
  }

  return bmd
}

export default class extends Phaser.Sprite {
  constructor ({ game, _x, _y, speed = 0 }) {
    let bmd = generateBitmap(game)
    let x = _x || game.world.width
    let y = _y || game.world.height - bmd.height

    super(game, x, y, bmd, 0)

    this.debug = true
    this.game.physics.arcade.enable(this)
    this.body.allowGravity = false
    this.body.immovable = true
    this.speed = speed
  }

  set speed (value) {
    this.body.velocity.x = value
  }
}
