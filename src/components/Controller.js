import Phaser from 'phaser'

import signals from '../signals'

const keys = {
  jump: Phaser.Keyboard.SPACEBAR,
  attack: Phaser.Keyboard.CONTROL
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
  _bindedKeys.jumpKey = game.input.keyboard.addKey(keys.jump)
  _bindedKeys.jumpKey.onDown.add(jump)
  _bindedKeys.attackKey = game.input.keyboard.addKey(keys.attack)
  _bindedKeys.attackKey.onDown.add(attack)
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
