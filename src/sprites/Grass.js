import Phaser from 'phaser'

export default class extends Phaser.Sprite {
  constructor (game, x, y) {
    super(game, x, y, 'surface.grass', game.rnd.between(1, 2))
  }
}
