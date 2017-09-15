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
    this.load.image('land-ground', 'assets/images/land/ground.png')
    this.load.image('land-swamp', 'assets/images/land/swamp.png')
    this.load.image('land-grass', 'assets/images/land/grass.png')
    this.load.image('bg-grass', 'assets/images/bg/grass.png')
    this.load.image('bg-clouds', 'assets/images/bg/clouds.png')
    this.load.image('bg-forest', 'assets/images/bg/forest.png')
    this.load.image('bg-trees', 'assets/images/bg/trees.png')
  }

  create () {
    this.state.start('Game')
  }
}
