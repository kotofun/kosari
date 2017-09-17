/* globals __DEV__ */
import Phaser from 'phaser'
import Player from '../../sprites/Player'

import Surface from './Surface'
import Background from './Background'
import Controller from './Controller'

export default class extends Phaser.State {
  init () {
    this.speed = 100

    this.Background = new Background(this, [
      this.game.add.tileSprite(0, this.game.height - 256, this.game.width, 256, 'bg.layer2'),
      this.game.add.tileSprite(0, this.game.height - 96, this.game.width, 96, 'bg.layer1')
    ])
    this.Player = new Player(this)
    this.Surface = new Surface(this)
  }

  preload () {
    this.game.physics.startSystem(Phaser.Physics.ARCADE)
    this.game.physics.arcade.gravity.y = 2000

    this.game.physics.arcade.enable(this.Player)
    this.game.physics.arcade.enable(this.Surface)

    this.game.add.existing(this.Player)
  }

  create () {
    this.Controller = new Controller(this)

    // TODO: Remove this line after generating initial surface
    // Now it helps not to drop out from the screen
    this.Player.body.collideWorldBounds = true

    this.Background.startAnimation()
  }

  update () {
    this.Surface.collide(this.Player)
    this.Surface.update()

    if (this.isGameOver()) {
      this.gameOver()
    }

    this.Controller.update()
  }

  // TODO: check all game over events
  isGameOver () {
    return this.Player.right < this.game.world.bounds.left
  }

  // TODO: Stop the game, show game over animation and show highscores
  gameOver () {
    //
  }
}
