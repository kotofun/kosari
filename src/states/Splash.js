import Phaser from 'phaser'
import { centerGameObjects } from '../utils'

import PlayerSprite from '../../assets/sprites/player_winter.png'
import PlayerJson from '../../assets/sprites/player_winter.json'
import ChaserSprite from '../../assets/sprites/chaser_winter.png'
import ChaserJson from '../../assets/sprites/chaser_winter.json'
import GrassSprite from '../../assets/sprites/snowdrift.png'
import GrassJson from '../../assets/sprites/snowdrift.json'
import BGSprite from '../../assets/sprites/bg.png'
import BGJson from '../../assets/sprites/bg.json'
import BatSprite from '../../assets/sprites/enemies/bat.png'
import BatJson from '../../assets/sprites/enemies/bat.json'
import CorgySprite from '../../assets/sprites/enemies/corgy.png'
import CorgyJson from '../../assets/sprites/enemies/corgy.json'
import SkeletonSprite from '../../assets/sprites/enemies/skeleton.png'
import SkeletonJson from '../../assets/sprites/enemies/skeleton.json'
import MenuSprite from '../../assets/sprites/menu.png'
import MenuJson from '../../assets/sprites/menu.json'

import SurfaceSprite from '../../assets/images/surface.png'
import GraveSprite from '../../assets/images/grave.png'
import PauseBtnSprite from '../../assets/images/pauseBtn.png'
import ReplayBtnSprite from '../../assets/images/replayBtn.png'
import ResumeBtnSprite from '../../assets/images/resumeBtn.png'
import NerdsBtnSprite from '../../assets/images/recordsBtn.png'
import ControlsInfoSprite from '../../assets/images/controlsInfo.png'
import DistanceSignSprite from '../../assets/images/distance_sign.png'

import SnowflakesSprite from '../../assets/sprites/snowflakes.png'

import SplashSprite from '../../assets/sprites/splash.png'

import SoundBG from '../../assets/audio/background.mp3'
import SoundJump from '../../assets/audio/jump.mp3'
import SoundMow from '../../assets/audio/mow.mp3'

export default class extends Phaser.State {
  init () {}

  preload () {
    // Полоса загрузки
    this.stage.backgroundColor = '#191820'
    this.loaderBg = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBg')
    this.loaderBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBar')
    centerGameObjects([this.loaderBg, this.loaderBar])

    this.load.setPreloadSprite(this.loaderBar)

    // Загрузка ассетов и атласов и именование
    // (анимации прописываются каждому объекту в его файле в папке sprites)

    this.load.atlas('player', PlayerSprite, null, PlayerJson)
    this.load.atlas('chaser', ChaserSprite, null, ChaserJson)
    this.load.image('surface', SurfaceSprite)

    this.load.atlas('grass', GrassSprite, null, GrassJson)
    this.load.image('grave', GraveSprite)

    this.load.atlas('bg', BGSprite, null, BGJson)

    this.load.atlas('enemies/skeleton', SkeletonSprite, null, SkeletonJson)
    this.load.atlas('enemies/bat', BatSprite, null, BatJson)
    this.load.atlas('enemies/corgy', CorgySprite, null, CorgyJson)

    this.load.atlas('menu', MenuSprite, null, MenuJson)

    this.load.image('pauseBtn', PauseBtnSprite)
    this.load.image('resumeBtn', ResumeBtnSprite)
    this.load.image('replayBtn', ReplayBtnSprite)
    this.load.image('nerdsBtn', NerdsBtnSprite)
    this.load.image('controlsInfo', ControlsInfoSprite)
    this.load.image('sign.distance', DistanceSignSprite)

    this.load.spritesheet('splash', SplashSprite, 256, 128)

    this.load.spritesheet('snowflakes', SnowflakesSprite, 96, 96)

    this.load.audio('sound.background', SoundBG)
    this.load.audio('sound.jump', SoundJump)
    this.load.audio('sound.attack', SoundMow)
  }

  create () {
    const { background, jump, attack } = this.game.vars.sounds
    this.game.sounds = {}
    this.game.sounds.background = this.game.sound.add('sound.background', background.volume, background.loop)
    this.game.sounds.jump = this.game.sound.add('sound.jump', jump.volume, jump.loop)
    this.game.sounds.attack = this.game.sound.add('sound.attack', attack.volume, attack.loop)

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
  }

  nextState () {
    // Удаляем реакцию на нажатие любой кнопки
    this.game.input.keyboard.onDownCallback = null

    // Меняем стейт
    this.state.start('Game')
  }
}
