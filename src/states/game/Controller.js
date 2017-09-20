import Phaser from 'phaser'
import Config from '../../config'

let jumpSpeed = Config.player.jumpSpeed
// TODO: Remove after surface generating
// Now it helps to jump on the surface from worldBounds
let first = true

let keys = {
  jump: Phaser.Keyboard.SPACEBAR,
  attack: Phaser.Keyboard.ENTER
}

// controller context
let ctx

export default class {
  constructor (context) {
    ctx = context
    this.game = context.game

    this.jumpKey = this.game.input.keyboard.addKey(keys.jump)
    this.attackKey = this.game.input.keyboard.addKey(keys.attack)

    for (let action in keys) {
      this.game.input.keyboard.addKeyCapture(keys[action])
    }
  }

  isJumped () {
    return this.jumpKey.isDown
  }

  update () {
    if (this.isJumped() && (ctx.Player.body.touching.down || first)) {
      ctx.Player.body.velocity.y = -jumpSpeed
      first = false
    }
  }
}
