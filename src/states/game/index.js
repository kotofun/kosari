/* globals __DEV__ */
import Phaser from 'phaser'
import Player from '../../sprites/Player'

import Land from './Land'

export default class extends Phaser.State {
  init () {
    this.bg = {
      forest: this.game.add.tileSprite(0, this.game.height - 192, this.game.width, 128, 'bg-forest'),
      trees: this.game.add.tileSprite(0, this.game.height - 200, this.game.width, 169, 'bg-trees'),
      grass: this.game.add.tileSprite(0, this.game.height - 94, this.game.width, 94, 'bg-grass'),
      clouds: this.game.add.tileSprite(0, 0, this.game.width, 64, 'bg-clouds')
    }
    this.bg.forest.autoScroll(-25, 0)
    this.bg.trees.autoScroll(-50, 0)
    this.bg.grass.autoScroll(-75, 0)
    this.bg.clouds.autoScroll(-100, 0)

    this.distance = 0

    this.player = new Player({ game: this.game, x: 240, y: 100, asset: 'player' })

    this.land = Land.init(this)
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
    this.spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)
    this.game.input.keyboard.addKeyCapture([ Phaser.Keyboard.SPACEBAR ])
  }

  update () {
    this.game.physics.arcade.collide(this.player, this.land)

    Land.update()

    if (this.isGameOver()) {
      this.gameOver()
    }

    if (this.spaceKey.isDown) {
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
