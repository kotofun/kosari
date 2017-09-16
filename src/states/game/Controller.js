import Phaser from 'phaser'

var keys = {
  jump: Phaser.Keyboard.SPACEBAR,
  attack: Phaser.Keyboard.ENTER
}

// controller context
var ctx

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
}
