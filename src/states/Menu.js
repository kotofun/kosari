import Phaser from 'phaser'
import Background from '../components/Background'
import config from '../config'

export default class extends Phaser.State {
  init () {
    this.stage.backgroundColor = config.bg.color
    this.background = new Background(this.game)

    // Добавление на экран земли, косарей и указателя соответственно
    this.game.add.tileSprite(0, this.game.height - 96, this.game.width, 96, 'menu', 'floor')
    this.game.add.sprite(50, this.game.height - 186, 'menu', 'kosari')
    this.menu = this.game.add.sprite(this.game.width - 137, this.game.height - 202, 'menu', 'sign')

    // Создание кнопки начала (__default значит что она прозрачная, так как сама она нарисована на фоне)
    this.playBtn = this.game.add.button(this.menu.left, this.menu.top + 18, '__default', this.play, this)
    this.playBtn.width = 87
    this.playBtn.height = 41
    // !!!: Additional buttons are transferred to next releases
    //
    // this.preferencesBtn = this.game.add.button(this.menu.left + 4, this.menu.top + 63, '__default', this.preferences, this)
    // this.preferencesBtn.width = 68
    // this.preferencesBtn.height = 18
    // this.authorsBtn = this.game.add.button(this.menu.left + 12, this.menu.top + 112, '__default', this.authors, this)
    // this.authorsBtn.width = 55
    // this.authorsBtn.height = 17

    // play background music
    this.game.sounds.background.play()

    // create menu section overlay
    this.overlay = this.game.add.graphics(0, 0)
    this.overlay.visible = false
    this.overlay.beginFill(0x1f1e26)
    this.overlay.fillAlpha = 0.8
    this.overlay.drawRect(0, 0, this.game.width, this.game.height)
    this.overlay.endFill()

    // Заголовки для будущих кнопок
    this.preferencesTitle = this.add.text(this.world.centerX, 32, 'Настройки')
    this.authorsTitle = this.add.text(this.world.centerX, 32, 'Авторы'); // this semicolon placed here due to webpack :(

    [this.preferencesTitle, this.authorsTitle].map(title => {
      title.visible = false
      title.font = 'Bangers'
      title.fontSize = 32
      title.fill = '#73727B'
      title.smoothed = false
      title.anchor.setTo(0.5)
    })
  }

  play () {
    // Перейти в стейт Игры
    this.state.start('Game')
  }
  preferences () {
    this.playBtn.inputEnabled = false
    this.overlay.visible = true
    this.preferencesTitle.visible = true
  }
  authors () {
    // authors screen
  }
}
