import Phaser from 'phaser'

import Ground from './Ground'
import Swamp from './Swamp'

// controller context
let ctx

// global game reference
let game

// game terrain instance
let terrain

export default class extends Phaser.Sprite {
  constructor (context, terrainInstance) {
    ctx = context
    game = ctx.game
    terrain = terrainInstance

    super(game, 0, 0, 'player')

    this.animations.add('run')
    this.animations.play('run', 30, true)

    this.game.physics.enable(this)
    this.body.setSize(19, 54, 43, 10)
  }

  isTimeToJump () {
    return (terrain.floor.getAt(0) instanceof Ground) &&
      (terrain.floor.getAt(2) instanceof Swamp)
  }

  update () {
    if (this.isTimeToJump()) this.jump()

    terrain.mowGrass(this)

    this.run()
  }

  run () {
    this.body.velocity.x = this.game.vars.speed
  }

  isOnFloor () {
    return this.body.touching.down
  }

  jump () {
    if (this.isOnFloor()) {
      this.body.velocity.y = -this.game.vars.player.jumpSpeed.y
    }
  }

  attack () {
    // attack animation
  }
}
