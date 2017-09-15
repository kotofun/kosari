import Phaser from 'phaser'
import Config from '../config'

export default class extends Phaser.TileSprite {
  constructor ({ game, x, y, speed = 0 }) {
    let tiles = Math.random() * (Config.grounds.width.min + Config.grounds.width.max) + Config.grounds.width.min
    let width = tiles * Config.tileSize
    let height = Config.grounds.height * Config.tileSize

    super(game, x, y, width, height, 'ground', 0)

    this.game.physics.arcade.enable(this)
    this.body.allowGravity = false
    this.body.immovable = true
    this.speed = speed
  }

  set speed (value) {
    this.body.velocity.x = value
  }
}
