import { generateSurfacePiceBitmap } from '../utils'
import swampTileSet from '../../assets/images/swamp.json'
import Surface from './Surface'

export default class extends Surface {
  constructor ({ game, type }) {
    let bmd = generateSurfacePiceBitmap(game, type, 1, swampTileSet, 'surface')

    let x = game.world.width
    let y = game.world.height - bmd.height

    super(game, x, y, bmd, 0)
  }
}
