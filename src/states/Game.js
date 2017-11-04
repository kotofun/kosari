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

import Stats from '../components/Stats'

import Swamp from '../sprites/Swamp'

import api from '../components/api'

export default class extends Phaser.State {
  init () {
    // Проверяем были ли уже созданы необходимые
    // объекты, если нет, то создаем
    if (!this.isBooted) {
      this.background = new Background(this.game)

      this.terrain = new Terrain(this.game, 'relax')
      this.floor = new FloorFactory(this.game, this.terrain.current.type)
      this.surface = new SurfaceManager(this.game)
      this.obstacles = new ObstacleManager(this.game)
      this.enemies = new EnemyManager(this, this.terrain)

      this.player = new Player(this.game)
      this.chaser = new Chaser(this.game, this.floor)

      this.ui = new UI(this.game)

      // Ставим флаг, чтобы при перезапуске объекты
      // не создавались заново
      this.isBooted = true
    }

    this.game.stats = Stats

    this.gameOver = false
  }

  create () {
    this.game.controller.createUIButtons()

    // set camera
    this.game.camera.bounds = null
    this.game.camera.follow(this.player, Phaser.Camera.FOLLOW_PLATFORMER, 1, 0)

    this.game.camera.deadzone = new Phaser.Rectangle(0, 0, this.player.startPosition.x, this.game.height)
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

      api.send({ distance: Math.floor(this.camera.x / 32), mowedGrass: this.game.stats.mowedGrass })
    } else {
      this.game.time.events.add(Phaser.Timer.SECOND, () => {
        this.ui.gameOverBanner.visible = false
      }, this).autoDestroy = true
    }
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
  }
}
