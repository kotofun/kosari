import Phaser from 'phaser'

import signals from '../../signals'

import Player from '../../sprites/Player'

import Chaser from '../../sprites/Chaser'

import Terrain from './Terrain'
import Background from './Background'
import Controller from './Controller'

import Skeleton from '../../sprites/Skeleton'
import Satan from '../../sprites/Satan'
import Zombie from '../../sprites/Zombie'
import Bat from '../../sprites/Bat'

import Swamp from '../../sprites/Swamp'
import Grave from '../../sprites/Grave'

export default class extends Phaser.State {
  init () {
    this.Background = new Background(this)
    this.Player = new Player(this)
    this.Terrain = new Terrain(this)

    this.Chaser = new Chaser(this, this.Terrain)

    this.characters = []
    this.characters.push(new Skeleton(this, this.game.width - 64, -64))
    this.characters.push(new Satan(this, this.game.width - 32, 0))
    this.characters.push(new Zombie(this, this.game.width - 64, 64))
    this.characters.push(new Bat(this, this.game.width - 64, this.game.height - 96))

    const { background, jump, attack } = this.game.vars.sounds
    this.game.sounds = {}
    this.game.sounds.background = this.game.sound.add('sound.background', background.volume, background.loop)
    this.game.sounds.jump = this.game.sound.add('sound.jump', jump.volume, jump.loop)
    this.game.sounds.attack = this.game.sound.add('sound.attack', attack.volume, attack.loop)
  }

  preload () {
    this.game.add.existing(this.Player)
    this.game.add.existing(this.Chaser)
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

    // enables fps
    this.game.time.advancedTiming = true

    const bannerText = 'Game Over'
    this.gameOverBanner = this.add.text(this.world.centerX, this.world.height / 2 - 20, bannerText)
    this.gameOverBanner.visible = false
    this.gameOverBanner.font = 'Bangers'
    this.gameOverBanner.padding.set(10, 16)
    this.gameOverBanner.fontSize = 40
    this.gameOverBanner.fill = '#8A0707'
    this.gameOverBanner.smoothed = false
    this.gameOverBanner.anchor.setTo(0.5)
    this.gameOverBanner.fixedToCamera = true

    // play background music
    this.game.sounds.background.play()
  }

  update () {
    this.Background.update()

    this.Terrain.collideFloor(this.Player, this.floorCollision)
    this.Terrain.collideFloor(this.Chaser)
    this.Terrain.collideFloor(this.characters)
    if (!this.Terrain.collideSurface(this.Player, this.surfaceCollision) && this.Player.slowedDown) {
      signals.speedReset.dispatch()
    }

    this.game.physics.arcade.collide(this.Player, this.Chaser, this.catched)

    this.Terrain.update()
  }

  render () {
    this.game.debug.text('fps: ' + this.game.time.fps, 2, 14, '#00ff00')
    this.game.debug.text('God Mode: ' + this.game.vars.godMode, 2, 30, '#00ff00')
  }

  catched (player, chaser) {
    signals.gameOver.dispatch()
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
    this.gameOverBanner.visible = true

    if (!this.game.vars.godMode) {
      this.game.paused = true
    } else {
      this.game.time.events.add(Phaser.Timer.SECOND, this.hideGameOverBanner, this).autoDestroy = true
    }
  }

  hideGameOverBanner () {
    this.gameOverBanner.visible = false
  }
}
