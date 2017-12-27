import AbstractObjectPool from './AbstractObjectPool'
import Ground from '../sprites/Ground'

export default class GroundPool extends AbstractObjectPool {
  _create () {
    let ground = new Ground(this.game)
    return ground
  }

  _onKill (object) {
    object.visible = false
    object.body.enable = false
  }

  _onActive (object) {
    object.visible = true
    object.body.enable = true
  }
}
