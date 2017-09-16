import Phaser from 'phaser'
import { generateSurfacePiceBitmap } from '../utils'
import swampTileSet from '../../assets/images/swamp.json'

export default class extends Phaser.Sprite {
  constructor ({ game, type, height = 1, speed = 0 }) {
    let bmd = generateSurfacePiceBitmap(game, type, height, swampTileSet, 'surface')
    let x = game.world.width
    let y = game.world.height - bmd.height

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
