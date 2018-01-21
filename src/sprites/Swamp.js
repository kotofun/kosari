import { generateSurfacePiceBitmap } from '../utils'
import swampTileSet from '../../assets/tilesets/swamp.json'
import AbstractFloor from './AbstractFloor'

export default class extends AbstractFloor {
  constructor(game) {
    let bmd = game.make.bitmapData(1, 1)
    super(game, 0, 0, bmd)

    this._bmd = bmd;
  }

  init({ type, x }) {
    generateSurfacePiceBitmap(this._bmd, type, 1, swampTileSet, 'surface')
    this.y = game.world.height - this._bmd.height
    this.x = x

    super.init();
    return this
  }
}
