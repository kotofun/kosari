import Phaser from 'phaser'

import signals from '../../signals'

const keys = {
  jump: Phaser.Keyboard.SPACEBAR,
  attack: Phaser.Keyboard.ENTER
}

const _bindedKeys = {}

const _initMobileControls = (game, { jump, attack }) => {
  const jumpBtn = game.add.button(game.camera.view.x, 0, '__default', jump)
  jumpBtn.fixedToCamera = true
  jumpBtn.height = game.world.height
  jumpBtn.width = game.world.width / 2

  const attackBtn = game.add.button(jumpBtn.right, 0, '__default', attack)
  attackBtn.fixedToCamera = true
  attackBtn.height = game.world.height
  attackBtn.width = game.world.width / 2
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
