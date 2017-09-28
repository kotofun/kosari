import AbstractSurface from './AbstractSurface'

export default class extends AbstractSurface {
  constructor ({ game, x, y }) {
    super(true, game, x, y, 'surface.grave', 0)

    this.body.setSize(25, 32, 36, 3)
  }
}
