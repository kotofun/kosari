import Phaser from 'phaser'
import WebpackLoader from 'phaser-webpack-loader'
import { centerGameObjects } from '../utils'
import AssetManifest from '../AssetManifest'

export default class extends Phaser.State {
  init () {}

  preload () {
    // Полоса загрузки
    this.stage.backgroundColor = '#191820'
    this.loaderBg = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBg')
    this.loaderBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBar')
    centerGameObjects([this.loaderBg, this.loaderBar])

    this.load.setPreloadSprite(this.loaderBar)
  }

  create () {
    this.game.plugins.add(WebpackLoader, AssetManifest)
      .load()
      .then(() => {
        // Загрузка музыки
        const { background, jump, attack } = this.game.vars.sounds
        this.game.sounds = {}
        this.game.sounds.background = this.game.sound.add('background', background.volume, background.loop)
        this.game.sounds.jump = this.game.sound.add('jump', jump.volume, jump.loop)
        this.game.sounds.attack = this.game.sound.add('mow', attack.volume, attack.loop)

        // Создание основной заставки в центре экрана
        const splash = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'splash')
        centerGameObjects([splash])

        // Загрузка основной заставки
        splash.animations.add('play')

        // Когда заставка начнется -- убрать полосы загрузки
        splash.events.onAnimationStart.add(() => {
          this.loaderBar.destroy()
          this.loaderBg.destroy()
        }, this)

        // А когда закончится перейти в следующий стейт
        splash.events.onAnimationComplete.add(this.nextState, this)

        // Добавляем пропуск заставки при нажатии на любую кнопку
        this.game.input.keyboard.onDownCallback = (e) => { this.nextState() }

        splash.animations.play('play', 20)
      })
  }

  nextState () {
    // Удаляем реакцию на нажатие любой кнопки
    this.game.input.keyboard.onDownCallback = null

    // Меняем стейт
    this.state.start('Game')
  }
}
