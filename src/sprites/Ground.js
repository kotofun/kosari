import { generateSurfacePiceBitmap } from '../utils'
import groundTileSet from '../../assets/tilesets/ground.json'
import AbstractFloor from './AbstractFloor'

export default class extends AbstractFloor {
  constructor(game) {
    let bmd = game.make.bitmapData(1, 1)
    super(game, 0, 0, bmd)

    this._bmd = bmd;
    this.standable = true
  }

  init({ type, height = 1, x = null, y = null }) {
    generateSurfacePiceBitmap(this._bmd, type, height, groundTileSet, 'surface')

    this.x = (x !== null) ? x : game.world.width
    this.y = (y !== null) ? y : game.world.height - this._bmd.height

    this.standable = true

    super.init();
    return this
  }
}
