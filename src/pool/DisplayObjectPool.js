import AbstractObjectPool from './AbstractObjectPool'

export default class DisplayObjectPool extends AbstractObjectPool {
  _onKill (object) {
    object.visible = false
    object.body.enable = false
  }

  _onActive (object) {
    object.visible = true
    object.body.enable = true
  }
}
