import Phaser from 'phaser'

import signals from '../signals'
import config from '../config'

import Ground from './Ground'
import Swamp from './Swamp'

let _floor

export default class extends Phaser.Sprite {
  constructor (game, floorManager) {
    super(game, 0, 0, 'player')

    _floor = floorManager

    this.animations.add('run', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
    this.animations.add('mow', [15, 16, 17])

    this.animationRun()

    this.game.physics.enable(this)
    this.body.setSize(19, 54, 43, 10)
    this.attackReady = true

    this.game.add.existing(this)

    this.backlogRate = 1

    signals.speedReset.add(this.slowDown, this)

    this.events.onAnimationComplete.add(() => {
      this.animationRun()
    })

    this.startPosition = {
      x: 0,
      y: this.game.height - 96
    }

    this.reset()
  }

  catch (obj, ...args) {
    return this.game.physics.arcade.collide(obj, this, ...args)
  }

  animationRun () {
    this.animations.play('run', 30, true)
  }

  isTimeToJump () {
    const cameraOffset = Math.max(0, this.x - this.game.camera.x)
    const bodyOffset = this.body.offset.x - this.body.width / 2
    const currentTile = Math.floor((cameraOffset + bodyOffset) / config.tileSize)

    return ((_floor.getAt(currentTile) instanceof Ground) &&
      (_floor.getAt(currentTile + 1) instanceof Swamp)) ||
      (_floor.getAt(currentTile) instanceof Swamp)
  }

  update () {
    if (this.isTimeToJump()) this.jump()

    if (this.left <= this.game.camera.x) {
      this.backlogRate = 1
    }

    this.run()
  }

  run () {
    this.body.velocity.x = this.game.vars.speed * this.backlogRate
  }

  isOnFloor () {
    return this.body.touching.down
  }

  jump () {
    if (this.isOnFloor()) {
      this.body.velocity.y = -this.game.vars.player.jumpSpeed.y
    }
  }

  mow () {
    if (this.attackReady) {
      this.attackReady = false
      this.game.time.events.add(Phaser.Timer.SECOND, () => { this.attackReady = true }, this).autoDestroy = true

      signals.mow.dispatch(this)
      this.animations.play('mow', 30, false)
    }
  }

  slowDown () {
    this.backlogRate = config.chaser.backlogRate
  }

  reset (x, y) {
    if (!(x || y)) {
      x = this.startPosition.x
      y = this.startPosition.y
    }

    super.reset(x, y)
  }
}
