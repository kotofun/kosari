import Phaser from 'phaser'

import signals from '../../signals'

import Player from '../../sprites/Player'
import Chaser from '../../sprites/Chaser'

import Terrain from './Terrain'
import Background from './Background'
import Controller from './Controller'
import EnemyManager from './EnemyManager'

import Swamp from '../../sprites/Swamp'
import Grave from '../../sprites/Grave'

export default class extends Phaser.State {
  init () {
    this.background = new Background(this)

    this.terrain = new Terrain(this)

    this.enemies = new EnemyManager(this)

    this.player = new Player(this, this.terrain)
    this.chaser = new Chaser(this, this.terrain)

    const { background, jump, attack } = this.game.vars.sounds
    this.game.sounds = {}
    this.game.sounds.background = this.game.sound.add('sound.background', background.volume, background.loop)
    this.game.sounds.jump = this.game.sound.add('sound.jump', jump.volume, jump.loop)
    this.game.sounds.attack = this.game.sound.add('sound.attack', attack.volume, attack.loop)
  }

  preload () {
    this.game.add.existing(this.player)
    this.game.add.existing(this.chaser)
  }

  create () {
    this.controller = new Controller(this)

    // set camera
    this.game.camera.bounds = null
    this.game.camera.follow(this.player, Phaser.Camera.FOLLOW_PLATFORMER, 1, 0)
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
    this.background.update()

    this.terrain.collideFloor(this.player, this.floorCollision)
    this.terrain.collideFloor(this.chaser)
    this.enemies.collide(this.terrain.floor)
    if (!this.terrain.collideSurface(this.player, this.surfaceCollision) && this.player.slowedDown) {
      signals.speedReset.dispatch()
    }

    this.game.physics.arcade.collide(this.player, this.chaser, this.catched)

    this.terrain.update()
    this.enemies.update()
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
