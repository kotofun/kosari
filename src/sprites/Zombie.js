import DisplayCharacter from './DisplayCharacter'

// TODO: create Zombie sprite

export default class extends DisplayCharacter {
  constructor (ctx, x, y) {
    super(ctx, x, y, 'character.zombie', true)
  }
}
