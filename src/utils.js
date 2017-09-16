import Phaser from 'phaser'

export const centerGameObjects = (objects) => {
  objects.forEach(function (object) {
    object.anchor.setTo(0.5)
  })
}

export const rnd = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min)
}

export const anyFrom = (arr) => {
  return arr[rnd(0, arr.length - 1)]
}

export const generateSurfacePiceBitmap = (game, type, yCount, tileSet, alias) => {
  function getArea (type, y) {
    switch (type) {
      case 'left': {
        if (y === 0) {
          return anyFrom(tileSet.corners.topLeft)
        } else if (y === yCount - 1) {
          return anyFrom(tileSet.left)
        } else {
          return anyFrom(tileSet.corners.bottomLeft)
        }
      }
      case 'middle': {
        if (y === 0) {
          return anyFrom(tileSet.top)
        } else if (y === yCount - 1) {
          return anyFrom(tileSet.middle)
        } else {
          return anyFrom(tileSet.bottom)
        }
      }
      case 'right': {
        if (y === 0) {
          return anyFrom(tileSet.corners.topRight)
        } else if (y === yCount - 1) {
          return anyFrom(tileSet.middle)
        } else {
          return anyFrom(tileSet.corners.bottomRight)
        }
      }
    }

    throw { ctx: generateSurfacePiceBitmap, message: 'Invalid surface type!' }
  }

  let tileWidth = tileSet.tileWidth
  let tileHeight = tileSet.tileHeight

  let bmd = game.make.bitmapData(tileWidth, yCount * tileHeight)

  for (let y = 0; y < yCount; y++) {
    let rect = getArea(type, y)
    let area = new Phaser.Rectangle(rect.x, rect.y, rect.w, rect.h)
    bmd.copyRect(alias, area, 0, y * rect.h)
  }

  return bmd
}
