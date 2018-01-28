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

import PoolManager from '../pool/PoolManager'
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

      this.ui = new UI(this.game)

      this.player = new Player(this.game)
      this.chaser = new Chaser(this.game, this.floor)

      // Ставим флаг, чтобы при перезапуске объекты
      // не создавались заново
      this.isBooted = true
    }

    this.game.stats = Stats

    this.game.isGameOver = false

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
      if (floor instanceof Swamp && !this.game.vars.godMode) {
        signals.onGameOver.dispatch()
      }
    })

    this.enemies.collide(this.player)
    this.obstacles.collide(this.player)

    this.chaser.catch(this.player, () => {
      if (!this.game.vars.godMode) signals.onGameOver.dispatch()
    })

    this.floor.collide(this.chaser)
    this.chaser.mow()

    this.floor.update()
    this.surface.update()
    this.obstacles.update()
    this.enemies.update()
    this.ui.update()
  }

  _debugBodies () {
    const rDebugBody = displayObject => {
      if (displayObject.body && displayObject.visible) {
        const color = displayObject.body.touching.none ? '#ff0000' : '#00ff00'
        this.game.debug.body(displayObject, color, false)
      }

      if (Array.isArray(displayObject.children)) {
        for (let i = 0; i < displayObject.children.length; ++i) {
          rDebugBody(displayObject.children[i])
        }
      }
    }

    rDebugBody(this.game.world)
  }

  render () {
    if (__DEV__) {
      this.game.debug.text('fps: ' + this.game.time.fps, 2, 14, '#00ff00')
      this.game.debug.text('God Mode: ' + this.game.vars.godMode, 2, 30, '#00ff00')
      this.game.debug.text(`Terrain: ${this.terrain.current.type} [${this.terrain.current.length}]`, 2, 46, '#00ff00')
      this.game.debug.text(`Player mowed: ${this.game.stats.mowedGrass.Player}`, 2, 62, '#00ff00')
      this.game.debug.text(`Chaser mowed: ${this.game.stats.mowedGrass.Chaser}`, 2, 78, '#00ff00')
      this._debugBodies()
      let i = 0
      for (let poolName in PoolManager.pools) {
        let enemyPoolsDebugStr = ' a: ' + PoolManager.pools[poolName].active.length + ' k: ' + PoolManager.pools[poolName].killed.length
        this.game.debug.text(poolName + enemyPoolsDebugStr, 2, 94 + i * 16, '#00ff00')
        i++
      }
    }

    const distance = Math.floor(this.camera.x / 32)
    this.ui.distance.text = distance + 'м'

    const signDistance = Math.floor((this.camera.x + this.game.width) / 32)
    const signPosition = signDistance * 32 + Math.floor(this.game.width * 0.5 / 32) * 32

    if ((this.game.isStarted) && (signDistance % 100 === 0) && this.prevSign !== signPosition) {
      this.ui.addSign(signPosition, this.game.height - 32, 'middle', signDistance + 'м')

      this.prevSign = signPosition
    }
  }

  // TODO: Stop the game, show game over animation and show highscores
  gameOver () {
    this.game.isGameOver = true
    this.pause()

    api.send({ distance: Math.floor(this.camera.x / 32), mowedGrass: this.game.stats.mowedGrass })
  }

  gameStart () {
    this.game.vars.speed = config.initialSpeed
    this.game.isStarted = true
  }

  pause () {
    this.game.vars.speed = 0
    this.game.physics.arcade.isPaused = true
    this.game.isPaused = true

    this.ui.togglePauseOverlay()
  }

  resume () {
    this.game.vars.speed = config.initialSpeed
    this.game.physics.arcade.isPaused = false
    this.game.isPaused = false

    this.ui.togglePauseOverlay()
  }

  replay () {
    if (this.game.isPaused) this.resume()
    this.game.state.restart(false)
    this.game.isGameOver = false
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
