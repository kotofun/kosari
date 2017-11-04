import signals from '../signals'

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

export default class {
  constructor (game) {
    this.game = game

    this.controlsInfo = this.game.add.sprite(32, 32, 'controlsInfo')
    this.controlsInfo.fixedToCamera = true

    this.overlay = _createOverlay(this.game)

    this.distance = this.game.add.text(this.game.width / 2, 32, '0м', { font: '40px HaxrCorp', align: 'center', fill: '#cccccc' })
    this.distance.anchor.setTo(0.5)
    this.distance.fixedToCamera = true

    this.gameOverBanner = _createGameOverBanner(this.game)
    this.pauseBanner = _createPauseBanner(this.game)

    this._initMenu()
    this._initButtons()
  }

  _initMenu () {
    this.menu = this.game.add.sprite(this.game.width - 137, this.game.height - 170, 'menu', 'sign')

    this.playBtn = this.game.add.button(this.menu.left, this.menu.top + 18, '__default', this.startGame, this)
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

    // create headers
    this.preferencesTitle = this.game.add.text(this.game.world.centerX, 32, 'Настройки')
    this.authorsTitle = this.game.add.text(this.game.world.centerX, 32, 'Авторы'); // this semicolon placed here due to webpack :(

    [this.preferencesTitle, this.authorsTitle].map(title => {
      title.visible = false
      title.font = 'HaxrCorp'
      title.fontSize = 32
      title.fill = '#8A0707'
      title.smoothed = false
      title.anchor.setTo(0.5)
    })
  }

  _initButtons () {
    this.pauseBtn = this.game.add.button(this.game.width - 64, 32, 'pauseBtn', () => {
      this.game.paused = true
    }, this)
    this.pauseBtn.fixedToCamera = true

    this.resumeBtn = this.game.add.button(this.game.width / 2, this.game.height / 2, 'resumeBtn', () => {
      this.game.paused = false
    })
    this.resumeBtn.anchor.setTo(0.5)
    this.resumeBtn.fixedToCamera = true
    this.resumeBtn.visible = false

    this.replayBtn = this.game.add.button(this.game.width / 2, this.game.height / 2, 'replayBtn', () => {
      this.game.state.restart(false)
      this.game.paused = false
    })
    this.replayBtn.anchor.setTo(0.5)
    this.replayBtn.fixedToCamera = true
    this.replayBtn.visible = false
  }

  showPreferences () {
    this.playBtn.inputEnabled = false
    this.overlay.visible = true
    this.preferencesTitle.visible = true
  }

  showAuthors () {
    //
  }

  startGame () {
    signals.gameStart.dispatch()
  }

  reset () {
    this.gameOverBanner.visible = false
  }
}
