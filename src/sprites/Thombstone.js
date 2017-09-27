import AbstractSurface from './AbstractSurface'

export default class extends AbstractSurface {
  constructor ({ game, x, y }) {
    super(true, game, x, y, 'surface.thombstone', 0)
  }
}
