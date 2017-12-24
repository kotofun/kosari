export default class AbstractObjectPool {
  constructor(game, preCreate = 0) {
    this.game = game
    this.killed = []
    this.active = []

    for (let i = 0; i < preCreate; i++)
      this.kill(this.get())
  }

  kill(object) {
    let index = this.active.indexOf(object)
    if (index === -1) {
      throw new Error('Could not find object')
    }

    this.active.splice(index, 1)
    this.killed.push(object)
    this._onKill(object)

    return object
  }

  killAll() {
    this.active.forEach(object => this.kill(object))
  }

  clear() {
    this.active.splice(0)
    this.killed.splice(0)
  }

  get() {
    let object = this.killed.pop()
    if (object === undefined) {
      object = this._create()
    }

    this.active.push(object)
    this._onActive(object)
    return object
  }

  _create() { }
  _onKill(object) { }
  _onActive(object) { }
}