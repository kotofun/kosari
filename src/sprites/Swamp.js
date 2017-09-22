import { generateSurfacePiceBitmap } from '../utils'
import swampTileSet from '../../assets/images/swamp.json'
import Surface from './Surface'

export default class extends Surface {
  constructor ({ game, type, height = 1, speed = 0 }) {
    let bmd = generateSurfacePiceBitmap(game, type, height, swampTileSet, 'surface')

    let x = game.world.width
    let y = game.world.height - bmd.height

    super(game, x, y, bmd, 0)

    this.speed = speed
  }
}
