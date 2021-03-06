import DisplayCharacter from './DisplayCharacter'

export default class extends DisplayCharacter {
  constructor (game, asset, body) {
    super(game, 0, 0, asset, body)

    this.exists = false
    this.alive = false
    this.visible = false

    this.body.allowGravity = false
    this.body.immovable = true
  }
}
