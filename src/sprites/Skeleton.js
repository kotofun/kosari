import DisplayCharacter from '../components/DisplayCharacter'

// TODO: create Skeleton sprite

export default class extends DisplayCharacter {
  constructor (ctx, x, y) {
    super(ctx, x, y, 'enemy.skeleton', true)

    this.body.setSize(28, 50, 2, 16)

    this.animations.add('idle')
    this.animations.play('idle', 10, true)

    this.body.allowGravity = false
    this.body.immovable = true
  }
}
