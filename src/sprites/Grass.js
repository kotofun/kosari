import Surface from './Surface'

export default class extends Surface {
  constructor ({ game, x, y, speed = 0 }) {
    super(game, x, y, 'surface.grass', game.rnd.between(1, 2))
  }
}
