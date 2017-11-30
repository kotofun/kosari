/* globals __DEV__ */
import Phaser from 'phaser'

import signals from '../signals'
import config from '../config'

import Player from '../sprites/Player'
import Chaser from '../sprites/Chaser'

import Terrain from '../components/Terrain'
import Background from '../components/Background'
import EnemyManager from '../components/EnemyManager'
import ObstacleManager from '../components/ObstacleManager'
import SurfaceManager from '../components/SurfaceManager'
import FloorFactory from '../components/FloorFactory'
import UI from '../components/UI'

import Stats from '../components/Stats'

import Swamp from '../sprites/Swamp'

import api from '../components/api'

export default class extends Phaser.State {
  init () {
    // Проверяем были ли уже созданы необходимые
    // объекты, если нет, то создаем
    if (!this.isBooted) {
      this.background = new Background(this.game)

      this.terrain = new Terrain(this.game)
      this.surface = new SurfaceManager(this.game)
      this.obstacles = new ObstacleManager(this.game)
      this.floor = new FloorFactory(this.game, this.terrain.current.type)
      this.enemies = new EnemyManager(this, this.terrain)

      this.player = new Player(this.game)
      this.chaser = new Chaser(this.game, this.floor)

      this.ui = new UI(this.game)

      // Ставим флаг, чтобы при перезапуске объекты
      // не создавались заново
      this.isBooted = true
    }

    this.game.stats = Stats

    this.isGameOver = false

    this.game.isStarted = false

    this.game.isPaused = false

    this.game.sounds.background.play()
  }

  create () {
    // set camera
    this.game.camera.bounds = null
    this.game.camera.follow(this.player, Phaser.Camera.FOLLOW_PLATFORMER, 1, 0)

    this.game.camera.deadzone = new Phaser.Rectangle(0, 0, this.player.startPosition.x, this.game.height)
    // don't remove this prevents player sprite jiggling
    this.game.renderer.renderSession.roundPixels = true

    signals.onGameStart.add(this.gameStart, this)
    signals.onGameOver.add(this.gameOver, this)
    signals.onGameReplay.add(this.replay, this)

    // enables fps
    this.game.time.advancedTiming = true

    signals.onGamePause.add(this.pause, this)
    signals.onGameResume.add(this.resume, this)

    this.game.controller.enableMenuControls()
  }

  update () {
    this.floor.collide(this.player, (player, floor) => {
      if (floor instanceof Swamp && !this.game.vars.godMode) signals.onGameOver.dispatch()
    })

    let collided = this.enemies.collide(this.player, this.playerSlowdown)
    collided |= this.obstacles.collide(this.player, this.playerSlowdown)

    if (!collided && this.player.slowedDown && this.game.isStarted) {
      signals.speedReset.dispatch()
    }

    this.chaser.catch(this.player, () => {
      if (!this.game.vars.godMode) signals.onGameOver.dispatch()
    })

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

  playerSlowdown (player, obstacle) {
    if (player.body.touching.right) signals.speedDown.dispatch()
  }

  // TODO: Stop the game, show game over animation and show highscores
  gameOver () {
    this.isGameOver = true
    this.ui.gameOverBanner.visible = true
    this.game.isPaused = true
    this.pause()

    api.send({ distance: Math.floor(this.camera.x / 32), mowedGrass: this.game.stats.mowedGrass })
  }

  gameStart () {
    this.game.vars.speed = config.initialSpeed
    this.game.isStarted = true
  }

  pause () {
    this.game.physics.arcade.isPaused = true

    this.game.vars.speed = 0
    this.ui.overlay.visible = true
    this.ui.pauseBtn.visible = false

    if (this.isGameOver) {
      this.ui.replayBtn.visible = true
    } else {
      this.ui.pauseBanner.visible = true
      this.ui.resumeBtn.visible = true
    }
  }

  resume () {
    this.game.physics.arcade.isPaused = false

    this.game.vars.speed = config.initialSpeed
    this.ui.overlay.visible = false
    this.ui.pauseBtn.visible = true

    if (this.isGameOver) {
      this.ui.replayBtn.visible = false
    } else {
      this.ui.pauseBanner.visible = false
      this.ui.resumeBtn.visible = false
    }
  }

  replay () {
    if (this.game.isPaused) this.resume()
    this.game.state.restart(false)
    this.game.isPaused = false
    this.isGameOver = false
  }

  // Функция вызывается при закрытии стейта.
  // Закрытие стейта происходит при смене стейта,
  // в том числе и при рестарте
  shutdown () {
    this.background.reset()

    this.enemies.reset()
    this.obstacles.reset()
    this.surface.reset()
    this.floor.reset()
    this.terrain.reset()

    this.player.reset()
    this.chaser.reset()
    this.ui.reset()

    this.game.stats.mowedGrass = { Player: 0, Chaser: 0 }
  }
}
