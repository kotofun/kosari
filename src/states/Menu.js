import Phaser from 'phaser'
import Background from '../components/Background'
import config from '../config'

export default class extends Phaser.State {
  init () {
    this.stage.backgroundColor = config.bg.color
    this.background = new Background(this.game)

    this.game.add.tileSprite(0, this.game.height - 96, this.game.width, 96, 'menu', 'floor')
    this.game.add.sprite(50, this.game.height - 186, 'menu', 'kosari')
    this.menu = this.game.add.sprite(this.game.width - 137, this.game.height - 202, 'menu', 'sign')

    this.playBtn = this.game.add.button(this.menu.left, this.menu.top + 18, '__default', this.play, this)
    this.playBtn.width = 87
    this.playBtn.height = 41
    this.preferencesBtn = this.game.add.button(this.menu.left + 4, this.menu.top + 63, '__default', this.preferences, this)
    this.preferencesBtn.width = 68
    this.preferencesBtn.height = 18
    this.authorsBtn = this.game.add.button(this.menu.left + 12, this.menu.top + 112, '__default', this.authors, this)
    this.authorsBtn.width = 55
    this.authorsBtn.height = 17
  }

  play () {
    this.state.start('Game')
  }
  preferences () {
    // preferences screen
  }
  authors () {
    // uathors screen
  }
}
