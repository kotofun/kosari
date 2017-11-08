import Phaser from 'phaser'

import signals from '../signals'

const keys = {
  jump: [
    Phaser.Keyboard.SPACEBAR,
    Phaser.Keyboard.W
  ],
  attack: [
    Phaser.Keyboard.CONTROL,
    Phaser.Keyboard.SHIFT,
    Phaser.Keyboard.ENTER,
    Phaser.Keyboard.D
  ]
}

const _bindedKeys = {}

const _initMobileControls = (game, { jump, attack }) => {
  game.input.onTap.add((pointer, doubleTap) => {
    const center = game.world.width / 2
    if (pointer.x <= center) jump()
    if (pointer.x > center) attack()
  }, game)
}

const _initDesktopControls = (game, { jump, attack }) => {
  _bindedKeys.jumpKey = keys.jump.map(k => game.input.keyboard.addKey(k))
  _bindedKeys.jumpKey.map(k => { k.onDown.add(jump) })
  _bindedKeys.attackKey = keys.attack.map(k => game.input.keyboard.addKey(k))
  _bindedKeys.attackKey.map(k => { k.onDown.add(attack) })
}

export default class {
  constructor (game) {
    this.game = game

    const keySignals = { jump: this.jump, attack: this.attack }
    if (this.game.device.desktop) {
      _initDesktopControls(this.game, keySignals)
    } else {
      _initMobileControls(this.game, keySignals)
    }
  }

  jump () {
    signals.jump.dispatch()
  }

  attack () {
    signals.attack.dispatch()
  }
}
