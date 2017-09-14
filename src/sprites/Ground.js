import Phaser from 'phaser'
import Config from '../config'

export default class extends Phaser.Group {
  constructor ({ game, x, y, speed = 0 }) {
    super(game)

    let groundLength = this.game.rnd.integerInRange(Config.grounds.width.min, Config.grounds.width.max)
    for (var i = 0; i < groundLength; i++) {
      let child = new Phaser.Sprite(game, Config.tileSize * i, 0, 'ground')
      this.disableGravity(child)
      this.addChild(child)
    }

    this.enableBody = true
    this.left = x
    this.bottom = y
    this.speed = speed
    this.game.physics.arcade.enable(this)
  }

  disableGravity (obj) {
    this.game.physics.arcade.enable(obj)
    obj.body.allowGravity = false
    obj.body.immovable = true
  }

  set speed (value) {
    this.setAll('body.velocity.x', value)
  }
}
