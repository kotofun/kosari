/* globals __DEV__ */
import Phaser from 'phaser'

import signals from '../signals'

import Player from '../sprites/Player'
import Chaser from '../sprites/Chaser'

import Terrain from '../components/Terrain'
import Background from '../components/Background'
import EnemyManager from '../components/EnemyManager'
import ObstacleManager from '../components/ObstacleManager'
import SurfaceManager from '../components/SurfaceManager'
import FloorFactory from '../components/FloorFactory'
import UI from '../components/UI'

import Swamp from '../sprites/Swamp'

import api from '../components/api'

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

    this.ui = new UI(this.game)

    this.game.mowedGrass = {Player: 0, Chaser: 0}

    this.gameOver = false
  }

  create () {
    this.game.controller.createUIButtons()

    // set camera
    this.game.camera.bounds = null
    this.game.camera.follow(this.player, Phaser.Camera.FOLLOW_PLATFORMER, 1, 0)

    this.game.camera.deadzone = new Phaser.Rectangle(0, 0, this.player.body.left - Math.floor(this.player.body.width / 2), this.game.height)
    // don't remove this prevents player sprite jiggling
    this.game.renderer.renderSession.roundPixels = true

    signals.gameOver.add(this.onGameOver, this)

    // enables fps
    this.game.time.advancedTiming = true

    this.game.onPause.add(this.pause, this)
    this.game.onResume.add(this.resume, this)
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
    this.chaser.mow()

    this.floor.update()
    this.surface.update()
    this.obstacles.update()
    this.enemies.update()
  }

  render () {
    if (__DEV__) {
      this.game.debug.text('fps: ' + this.game.time.fps, 2, 14, '#00ff00')
      this.game.debug.text('God Mode: ' + this.game.vars.godMode, 2, 30, '#00ff00')
      this.game.debug.text(`Terrain: ${this.terrain.current.type} [${this.terrain.current.length}]`, 2, 46, '#00ff00')
    }

    this.ui.distance.text = Math.floor(this.camera.x / 32) + 'м'
  }

  floorCollision (player, floor) {
    if (floor instanceof Swamp) signals.gameOver.dispatch()
  }

  playerSlowdown (player, obstacle) {
    if (player.body.touching.right) signals.speedDown.dispatch()
  }

  // TODO: Stop the game, show game over animation and show highscores
  onGameOver () {
    this.gameOver = true
    this.ui.gameOverBanner.visible = true

    if (!this.game.vars.godMode) {
      this.game.paused = true

      api.send({ distance: Math.floor(this.camera.x / 32), mowedGrass: this.game.mowedGrass })
    } else {
      this.game.time.events.add(Phaser.Timer.SECOND, this.hideGameOverBanner, this).autoDestroy = true
    }
  }

  hideGameOverBanner () {
    this.ui.gameOverBanner.visible = false
  }

  pause () {
    this.ui.overlay.visible = true
    this.game.controller.pauseBtn.visible = false

    if (this.gameOver) {
      this.game.controller.replayBtn.visible = true
    } else {
      this.ui.pauseBanner.visible = true
      this.game.controller.resumeBtn.visible = true
    }
  }

  resume () {
    this.ui.overlay.visible = false
    this.game.controller.pauseBtn.visible = true

    if (this.gameOver) {
      this.game.controller.replayBtn.visible = false
    } else {
      this.ui.pauseBanner.visible = false
      this.game.controller.resumeBtn.visible = false
    }
  }
}
