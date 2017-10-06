import AbstractEnemy from './AbstractEnemy'

export default class extends AbstractEnemy {
  constructor (game) {
    super(game, 'enemy.skeleton', true)

    this.body.setSize(28, 50, 2, 16)

    this.animations.add('idle')
    this.animations.play('idle', 10, true)
  }
}
