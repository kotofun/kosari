import Phaser from 'phaser'

import signals from '../signals'

import Player from '../sprites/Player'
import Chaser from '../sprites/Chaser'

import Terrain from '../components/Terrain'
import Background from '../components/Background'
import Controller from '../components/Controller'
import EnemyManager from '../components/EnemyManager'
import ObstacleManager from '../components/ObstacleManager'
import SurfaceManager from '../components/SurfaceManager'
import FloorFactory from '../components/FloorFactory'

import Swamp from '../sprites/Swamp'

export default class extends Phaser.State {
  init () {
    this.background = new Background(this.game)

    this.terrain = new Terrain(this.game, 'relax')
    this.floor = new FloorFactory(this.game, this.terrain.current.type)
    this.surface = new SurfaceManager(this.game)
    this.obstacles = new ObstacleManager(this.game)
    this.enemies = new EnemyManager(this, this.terrain)

    this.player = new Player(this.game)
    this.chaser = new Chaser(this.game, this.floor)
  }

  create () {
    this.controller = new Controller(this.game)

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

    this.floor.collide(this.player, this.floorCollision)
    if (!this.enemies.collide(this.player, this.playerSlowdown) && this.player.slowedDown) {
      signals.speedReset.dispatch()
    }
    if (!this.obstacles.collide(this.player, this.playerSlowdown) && this.player.slowedDown) {
      signals.speedReset.dispatch()
    }

    this.chaser.catch(this.player, () => { signals.gameOver.dispatch() })

    this.floor.collide(this.chaser)
    this.surface.mow(this.chaser)

    this.floor.update()
    this.surface.update()
    this.obstacles.update()
    this.enemies.update()
  }

  render () {
    this.game.debug.text('fps: ' + this.game.time.fps, 2, 14, '#00ff00')
    this.game.debug.text('God Mode: ' + this.game.vars.godMode, 2, 30, '#00ff00')
    this.game.debug.text(`Terrain: ${this.terrain.current.type} [${this.terrain.current.length}]`, 2, 46, '#00ff00')
  }

  floorCollision (player, floor) {
    if (floor instanceof Swamp) signals.gameOver.dispatch()
  }

  playerSlowdown (player, obstacle) {
    if (player.body.touching.right) signals.speedDown.dispatch()
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
