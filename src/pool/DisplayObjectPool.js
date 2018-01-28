import AbstractObjectPool from './AbstractObjectPool'

export default class DisplayObjectPool extends AbstractObjectPool {
  _onKill (object) {
    object.visible = false

    if (object.body !== null) {
      object.body.enable = false
    }
  }

  _onActive (object) {
    object.visible = true

    if (object.body !== null) {
      object.body.enable = true
    }
  }
}
