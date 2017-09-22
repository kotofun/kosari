import { generateSurfacePiceBitmap } from '../utils'
import groundTileSet from '../../assets/images/ground.json'
import Surface from './Surface'

export default class extends Surface {
  constructor ({ game, type, height = 1, speed = 0, x = null, y = null }) {
    let bmd = generateSurfacePiceBitmap(game, type, height, groundTileSet, 'surface')

    let _x = (x !== null) ? x : game.world.width
    let _y = (y !== null) ? y : game.world.height - bmd.height

    super(game, _x, _y, bmd, 0)

    this.speed = speed
  }
}
