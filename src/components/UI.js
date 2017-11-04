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
  }

  reset () {
    this.gameOverBanner.visible = false
  }
}
