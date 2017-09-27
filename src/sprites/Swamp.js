import { generateSurfacePiceBitmap } from '../utils'
import swampTileSet from '../../assets/images/swamp.json'
import AbstractFloor from './AbstractFloor'

export default class extends AbstractFloor {
  constructor ({ game, type, x }) {
    let bmd = generateSurfacePiceBitmap(game, type, 1, swampTileSet, 'surface')

    let y = game.world.height - bmd.height

    super(game, x, y, bmd, 0)
  }
}
