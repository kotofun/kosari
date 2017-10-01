import DisplayCharacter from '../components/DisplayCharacter'

// TODO: create Skeleton sprite

export default class extends DisplayCharacter {
  constructor (ctx, x, y) {
    super(ctx, x, y, 'character.skeleton', true)

    this.body.allowGravity = false
    this.body.immovable = true
  }
}
