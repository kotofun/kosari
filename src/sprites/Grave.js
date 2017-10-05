import AbstractObstacle from './AbstractObstacle'

export default class extends AbstractObstacle {
  constructor (game) {
    super(true, game, 0, 0, 'surface.grave', 0)

    this.body.setSize(25, 32, 36, 3)
  }
}
