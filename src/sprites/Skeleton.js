import Enemy from '../components/Enemy'

export default class extends Enemy {
  constructor (ctx) {
    super(ctx, 'enemy.skeleton', true)

    this.body.setSize(28, 50, 2, 16)

    this.animations.add('idle')
    this.animations.play('idle', 10, true)
  }
}
