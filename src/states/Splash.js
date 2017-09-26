import Phaser from 'phaser'
import { centerGameObjects } from '../utils'

export default class extends Phaser.State {
  init () {}

  preload () {
    this.loaderBg = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBg')
    this.loaderBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBar')
    centerGameObjects([this.loaderBg, this.loaderBar])

    this.load.setPreloadSprite(this.loaderBar)
    //
    // load your assets
    //
    this.load.image('player', 'assets/images/player.png')
    this.load.image('surface', 'assets/images/surface.png')

    this.load.atlas('surface.grass', 'assets/images/grass.png', 'assets/images/grass.json')

    this.load.atlas('bg', 'assets/images/bg.png', 'assets/images/bg.json')

    this.load.image('character.skeleton', 'assets/images/characters/skeleton.png')
  }

  create () {
    this.state.start('Game')
  }
}
