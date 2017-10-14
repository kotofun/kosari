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

const _createOverlay = game => {
  const overlay = game.add.graphics(0, 0)
  overlay.visible = false
  overlay.beginFill(0x1f1e26)
  overlay.fillAlpha = 0.8
  overlay.drawRect(0, 0, game.width, game.height)
  overlay.endFill()
  overlay.fixedToCamera = true

  return overlay
}

const _createGameOverBanner = state => {
  const gameOverBanner = state.add.text(state.world.centerX, state.world.height / 2 - 20, 'Game Over')
  gameOverBanner.visible = false
  gameOverBanner.font = 'HaxrCorp'
  gameOverBanner.padding.set(10, 16)
  gameOverBanner.fontSize = 40
  gameOverBanner.fill = '#8A0707'
  gameOverBanner.smoothed = false
  gameOverBanner.anchor.setTo(0.5)
  gameOverBanner.fixedToCamera = true

  return gameOverBanner
}

const _createPauseBanner = state => {
  const banner = state.add.text(state.world.centerX, 20, 'Продолжить')
  banner.visible = false
  banner.font = 'HaxrCorp'
  banner.padding.set(10, 16)
  banner.fontSize = 40
  banner.fill = '#cccccc'
  banner.smoothed = false
  banner.anchor.setTo(0.5)
  banner.fixedToCamera = true

  return banner
}

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

    const info = this.game.add.sprite(32, 32, 'controlsInfo')
    info.fixedToCamera = true

    this.overlay = _createOverlay(this.game)

    this.gameOver = false
  }

  create () {
    this.controller = new Controller(this.game)

    // set camera
    this.game.camera.bounds = null
    this.game.camera.follow(this.player, Phaser.Camera.FOLLOW_PLATFORMER, 1, 0)

    this.game.camera.deadzone = new Phaser.Rectangle(0, 0, this.player.body.left - Math.floor(this.player.body.width / 2), this.game.height)
    // don't remove this prevents player sprite jiggling
    this.game.renderer.renderSession.roundPixels = true

    signals.gameOver.add(this.onGameOver, this)

    // enables fps
    this.game.time.advancedTiming = true

    this.gameOverBanner = _createGameOverBanner(this.game)
    this.pauseBanner = _createPauseBanner(this.game)

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
    this.surface.mow(this.chaser)

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

  pause () {
    this.overlay.visible = true

    if (!this.gameOver) {
      this.pauseBanner.visible = true
      this.controller.resumeBtn.visible = true
    }
  }

  resume () {
    this.overlay.visible = false

    if (!this.gameOver) {
      this.pauseBanner.visible = false
      this.controller.resumeBtn.visible = false
    }
  }
}
