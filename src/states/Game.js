/* globals __DEV__ */
import Phaser from 'phaser'
import Player from '../sprites/Player'
import Ground from '../sprites/Ground'
import Config from '../config'

export default class extends Phaser.State {
  init () {
    this.gameSpeed = 3

    this.game.physics.startSystem(Phaser.Physics.ARCADE)
    this.game.physics.arcade.gravity.y = 2000

    this.player = new Player({
      game: this.game,
      x: 240,
      y: 100,
      asset: 'player'
    })

    this.grounds = this.game.add.group()
  }

  preload () {
    this.game.physics.arcade.enable(this.player)
    this.game.physics.arcade.enable(this.grounds)

    this.player.body.collideWorldBounds = true
    this.game.add.existing(this.player)
  }

  create () {
    this.nextGap()
    this.nextGround()
  }

  update () {
    for (var i = 0; i < this.grounds.length; i++) {
      if (this.game.physics.arcade.collide(this.player, this.grounds[i])) {
        console.log('collided')
      }
    }

    this.grounds.forEachAlive(this.updateGround, this)

    let lastGround = this.grounds.getAt(this.grounds.children.length - 1)
    if ((this.game.world.bounds.right - lastGround.right) > this.lastGap) {
      this.nextGround()
      this.nextGap()
    }
  }

  nextGap () {
    this.lastGap = Config.tileSize * this.game.rnd.integerInRange(Config.gaps.width.min, Config.gaps.width.max)
  }

  nextGround () {
    let diff = Config.grounds.dropHeight * this.game.rnd.integerInRange(1, 10)

    this.grounds.add(new Ground({
      game: this.game,
      x: this.game.world.width,
      y: this.game.world.height - diff,
      speed: -100 * this.gameSpeed
    }))
  }

  updateGround (ground) {
    if (ground.right < this.world.bounds.left) {
      this.grounds.remove(ground, true)
    }
  }
}
