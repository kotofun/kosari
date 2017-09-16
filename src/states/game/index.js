/* globals __DEV__ */
import Phaser from 'phaser'
import Player from '../../sprites/Player'

import Land from './Land'
import Background from './Background'
import Controller from './Controller'

export default class extends Phaser.State {
  init () {
    this.background = new Background(this)

    this.distance = 0

    this.player = new Player({ game: this.game, x: 240, y: 100, asset: 'player' })

    this.land = new Land(this)
  }

  preload () {
    this.game.physics.startSystem(Phaser.Physics.ARCADE)
    this.game.physics.arcade.gravity.y = 2000

    this.game.physics.arcade.enable(this.player)
    this.game.physics.arcade.enable(this.land)

    this.player.body.collideWorldBounds = true
    this.game.add.existing(this.player)
  }

  create () {
    this.controller = new Controller(this)

    this.background.startAnimation()
  }

  update () {
    this.land.collide(this.player)
    this.land.update()

    if (this.isGameOver()) {
      this.gameOver()
    }

    if (this.controller.isJumped()) {
      this.player.body.velocity.y = -600
    }
  }

  isGameOver () {
    return this.player.right < this.game.world.bounds.left
  }

  gameOver () {
    //
  }
}
