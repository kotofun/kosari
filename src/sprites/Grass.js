import AbstractSurface from './AbstractSurface'

export default class extends AbstractSurface {
  constructor ({ game, x, y }) {
    super(false, game, x, y, 'surface.grass', game.rnd.between(1, 2))
  }
}
