import AbstractObjectPool from "./AbstractObjectPool";
import Swamp from '../sprites/Swamp'

export default class SwampPool extends AbstractObjectPool {
  _create() {
    return new Swamp(this.game)
  }

  _onKill(object) {
    object.visible = false
    object.body.enable = false
  }

  _onActive(object) {
    object.visible = true
    object.body.enable = true
   }
}