import AbstractObjectPool from './AbstractObjectPool'
let pools = []

export default class DisplayObjectPool extends AbstractObjectPool {
  constructor (game, objectConstructor) {
    super()
    this.game = game
    this._objectConstructor = objectConstructor

    pools.push(this)
  }

  _create () {
    return new this._objectConstructor(this.game)
  }

  _onKill (object) {
    object.visible = false
    object.body.enable = false
  }

  _onActive (object) {
    object.visible = true
    object.body.enable = true
  }

  static getInstanceByObject (object) {
    for (let key in pools) {
      if (pools.hasOwnProperty(key) && object instanceof pools[key]._objectConstructor) {
        return pools[key]
      }
    }
    throw new Error('Could not find pool instance')
  }
}
