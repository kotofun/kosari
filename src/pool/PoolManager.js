let _pools = []
let _poolConstructor

export default class PoolManager {
  constructor (game, poolConstructor) {
    this.game = game
    _poolConstructor = poolConstructor
  }

  create (objectConstructor) {
    let pool = new _poolConstructor(this.game, objectConstructor)
    _pools.push(pool)

    return pool
  }

  getPoolFor (object) {
    let pool

    if (typeof object === 'object') {
      pool = this._findPoolByObject(object)
    } else if (typeof object === 'function') {
      pool = this._findPoolByConstructor(object)
    }

    if (pool === undefined) {
      throw new Error('Could not find pool instance')
    }

    return pool
  }

  _findPoolByObject (object) {
    for (let key in _pools) {
      if (_pools.hasOwnProperty(key) && object instanceof _pools[key]._objectConstructor) {
        return _pools[key]
      }
    }
  }

  _findPoolByConstructor (_constructor) {
    for (let key in _pools) {
      if (_pools.hasOwnProperty(key) && _constructor === _pools[key]._objectConstructor) {
        return _pools[key]
      }
    }
  }

  clear () {
    for (let key in _pools) {
      _pools[key].clear()
    }
  }
}
