import Skeleton from '../../sprites/Skeleton'
import Bat from '../../sprites/Bat'

// controller context
let ctx

// global game reference
let game

// enemy swap
let _enemies

const _init = () => {
  _enemies.add(new Bat(ctx, game.width, game.height - 64))
  _enemies.add(new Skeleton(ctx, game.width - 64, -64))
}

const _updateAlive = (enemy) => {
  if (enemy.right < game.camera.view.x) enemy.kill()
}

const _updateDead = (enemy) => {
  enemy.reset(game.camera.view.right + enemy.width + 32, game.world.height - 32 - enemy.height)
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

  update () {
    _enemies.forEachDead(_updateDead)
    _enemies.forEachAlive(_updateAlive)
  }
}
