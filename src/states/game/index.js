/* globals __DEV__ */
import Phaser from 'phaser'

import config from '../../config'
import signals from '../../signals'

import Player from '../../sprites/Player'

import Terrain from './Terrain'
import Background from './Background'
import Controller from './Controller'

import Skeleton from '../../sprites/Skeleton'
import Satan from '../../sprites/Satan'
import Zombie from '../../sprites/Zombie'

import Swamp from '../../sprites/Swamp'
import Grave from '../../sprites/Grave'

export default class extends Phaser.State {
  init () {
    this.Background = new Background(this, [
      this.game.add.tileSprite(0, -192, this.game.width, 512, 'bg', 'sky'),
      this.game.add.tileSprite(0, 0, this.game.width, 275, 'bg', 'clouds'),
      this.game.add.tileSprite(0, this.game.height - 225, this.game.width, 225, 'bg', 'forest'),
      this.game.add.tileSprite(0, this.game.height - 253, this.game.width, 253, 'bg', 'cemetery'),
      this.game.add.tileSprite(0, this.game.height - 86, this.game.width, 86, 'bg', 'grass')
    ])
    this.Player = new Player(this)
    this.Terrain = new Terrain(this)
    this.characters = []
    this.characters.push(new Skeleton(this, this.game.width - 64, -64))
    this.characters.push(new Satan(this, this.game.width - 32, 0))
    this.characters.push(new Zombie(this, this.game.width - 64, 64))
  }

  preload () {
    this.game.add.existing(this.Player)
    this.characters.map(char => { this.game.add.existing(char) })
  }

  create () {
    this.Controller = new Controller(this)

    // set camera
    this.game.camera.bounds = null
    this.game.camera.follow(this.Player, Phaser.Camera.FOLLOW_PLATFORMER, 1, 0)
    this.game.camera.deadzone = new Phaser.Rectangle(0, 0, this.game.vars.player.position.x, this.game.height)
    // don't remove this prevents player sprite jiggling
    this.game.renderer.renderSession.roundPixels = true

    signals.gameOver.add(this.gameOver, this)
  }

  update () {
    this.Background.update()

    this.Terrain.collideFloor(this.Player, this.floorCollision)
    this.Terrain.collideFloor(this.characters)
    this.Terrain.collideSurface(this.Player, this.surfaceCollision)

    this.Terrain.update()

    this.Controller.update()
  }

  floorCollision (player, floor) {
    if (floor instanceof Swamp) signals.gameOver.dispatch()
  }

  surfaceCollision (player, surface) {
    // Player bumbed into grave
    if (surface instanceof Grave && player.body.touching.right) signals.speedDown.dispatch()
  }

  // TODO: Stop the game, show game over animation and show highscores
  gameOver () {
    const bannerText = 'Game Over'
    let banner = this.add.text(this.world.centerX, this.world.height / 2 - 20, bannerText)
    banner.font = 'Bangers'
    banner.padding.set(10, 16)
    banner.fontSize = 40
    banner.fill = '#8A0707'
    banner.smoothed = false
    banner.anchor.setTo(0.5)
    banner.fixedToCamera = true

    this.game.paused = true
  }
}
