import Phaser from 'phaser'

import signals from '../../signals'

let keys = {
  jump: Phaser.Keyboard.SPACEBAR,
  attack: Phaser.Keyboard.ENTER
}

// controller context
let ctx

// global game reference
let game

export default class {
  constructor (context) {
    ctx = context
    game = ctx.game

    this.jumpKey = game.input.keyboard.addKey(keys.jump)
    this.jumpKey.onDown.add(() => { signals.jump.dispatch() })
    this.attackKey = game.input.keyboard.addKey(keys.attack)
    this.attackKey.onDown.add(() => { signals.attack.dispatch() })
  }
}
