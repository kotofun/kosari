import Skeleton from '../../sprites/Skeleton'
import Bat from '../../sprites/Bat'

let ctx
let game

let _enemies

const _init = () => {
  _enemies.add(new Bat(ctx, game.width, game.height - 64))
  _enemies.add(new Skeleton(ctx, game.width - 64, -64))
}

export default class {
  constructor (context) {
    ctx = context
    game = ctx.game

    _enemies = game.add.group()

    _init()
  }

  collide (obj, ...args) {
    game.physics.arcade.collide(obj, _enemies, ...args)
  }
}
