import Phaser from 'phaser'
import { generateSurfacePiceBitmap } from '../utils'
import groundTileSet from '../../assets/images/ground.json'

export default class extends Phaser.Sprite {
  constructor ({ game, type, height = 1, speed = 0, x = null, y = null }) {
    let bmd = generateSurfacePiceBitmap(game, type, height, groundTileSet, 'surface')

    let _x = (x !== null) ? x : game.world.width
    let _y = (y !== null) ? y : game.world.height - bmd.height

    super(game, _x, _y, bmd, 0)

    this.game.physics.arcade.enable(this)
    this.body.allowGravity = false
    this.body.immovable = true
    this.speed = speed
  }

  set speed (value) {
    this.body.velocity.x = value
  }
}
