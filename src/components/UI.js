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
  const gameOverBanner = state.add.text(state.world.centerX, state.world.height / 2 - 30, 'Game Over')
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

const _createDistance = game => {
  let distance = game.add.text(game.width / 2, 40, '0м', { font: '40px HaxrCorp', align: 'center', fill: '#cccccc' })
  distance.anchor.setTo(0.5)
  distance.fixedToCamera = true

  return distance
}

export default class {
  constructor (game) {
    this.game = game

    this.controlsInfo = this.game.add.sprite(32, 32, 'controlsInfo')
    this.controlsInfo.fixedToCamera = true

    this._initMenu()

    this.signs = this.game.add.group()
    // Перемещаем таблички поверх бэка но за землю
    this.game.world.sendToBack(this.signs)
    this.game.world.moveUp(this.signs)
    this.game.world.moveUp(this.signs)
    this.game.world.moveUp(this.signs)
    this.game.world.moveUp(this.signs)
    this.game.world.moveUp(this.signs)
    this.signLabels = this.game.add.group()

    this.overlay = _createOverlay(this.game)
    this.distance = _createDistance(this.game)
    this.gameOverBanner = _createGameOverBanner(this.game)
    this.pauseBanner = _createPauseBanner(this.game)
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
    this.pauseBtn = this.game.add.button(this.game.width - 64, 32, 'pauseBtn', this.pauseGame, this)
    this.pauseBtn.fixedToCamera = true

    this.resumeBtn = this.game.add.button(this.game.width / 2, this.game.height / 2, 'resumeBtn', this.resumeGame, this)
    this.resumeBtn.anchor.setTo(0.5)
    this.resumeBtn.fixedToCamera = true
    this.resumeBtn.visible = false

    this.replayBtn = this.game.add.button(this.game.width / 2, this.game.height / 2, 'replayBtn', this.replayGame, this)
    this.replayBtn.anchor.setTo(0.5)
    this.replayBtn.fixedToCamera = true
    this.replayBtn.visible = false

    this.nerdsBtn = this.game.add.button(this.game.world.centerX, 100, 'nerdsBtn', this.showNerds, this)
    this.nerdsBtn.anchor.setTo(0.5)
    this.nerdsBtn.fixedToCamera = true
    this.nerdsBtn.visible = false
  }

  showPreferences () {
    this.playBtn.inputEnabled = false
    this.overlay.visible = true
    this.preferencesTitle.visible = true
  }

  showNerds () {
    window.open('/nerds', '_blank')
  }

  togglePauseOverlay () {
    if (this.game.isPaused) {
      this.overlay.visible = true
      this.pauseBtn.visible = false
      this.nerdsBtn.visible = true

      if (this.game.isGameOver) {
        this.replayBtn.visible = true
        this.gameOverBanner.visible = true
      } else {
        this.pauseBanner.visible = true
        this.resumeBtn.visible = true
      }
    } else {
      this.overlay.visible = false
      this.pauseBtn.visible = true
      this.nerdsBtn.visible = false

      if (this.game.isGameOver) {
        this.replayBtn.visible = false
        this.gameOverBanner.visible = false
      } else {
        this.pauseBanner.visible = false
        this.resumeBtn.visible = false
      }
    }
  }

  addSign (x, y, size, text) {
    // добавляем спрайт таблички
    const sign = this.game.add.sprite(x, y, 'sign.distance')
    // ставим якорь внизу, по центру
    sign.anchor.setTo(0.5, 1)
    // добавляем текст для таблички
    const signText = this.game.add.text(sign.left + sign.width / 2, sign.top + 30, text)
    signText.font = 'HaxrCorp'
    signText.fontSize = 24
    signText.fill = '#8A0707'
    signText.smoothed = false
    signText.anchor.setTo(0.5)

    // засовываем в массив табличек для дальнейшего удаления
    this.signs.add(sign)
    this.signLabels.add(signText)
  }

  addBanner (x, y) {
    const banner = this.game.add.sprite(x, y, 'sign.banner')
    banner.anchor.setTo(0.4, 1)
    this.signs.add(banner)
  }

  update () {
    this.signs.forEachAlive(sign => {
      if (sign.right < this.game.camera.view.x) sign.kill()
    })
    this.signLabels.forEachAlive(label => {
      if (label.right < this.game.camera.view.x) label.kill()
    })
  }

  showAuthors () {
    //
  }

  pauseGame () {
    signals.onGamePause.dispatch()
  }

  resumeGame () {
    signals.onGameResume.dispatch()
  }

  startGame () {
    if (!this.game.isPaused) signals.onGameStart.dispatch()
  }

  replayGame () {
    signals.onGameReplay.dispatch()
  }

  reset () {
    this.gameOverBanner.visible = false
  }
}
