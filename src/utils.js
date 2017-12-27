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

export const generateSurfacePiceBitmap = (bmd, type, yCount, tileSet, alias) => {
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

  bmd.clear()
  bmd.resize(tileWidth, tileHeight)

  for (let y = 0; y < yCount; y++) {
    let rect = getArea(type, y)
    let area = new Phaser.Rectangle(rect.x, rect.y, rect.w, rect.h)
    bmd.copyRect(alias, area, 0, y * rect.h)
  }

  return bmd
}

/**
 * Парсилка анимаций для спрайтов, которые могут анимироваться, пока живые,
 * анимироваться при убийстве, и при других обстоятельствах.
 *
 * В подгруженном спрайтшите все кадры должны именоваться следующим образом:
 *
 * name_number_index
 *
 * name - {String} имя для типа кадра, может быть live (для "живой" анимации спрайта,
 * до скоса косой), kill (анимация уничтожения спрайта) и другие
 * number - {Number} вариант анимации, отвечает за группировку кадров анимации
 * index - {Number} порядковый номер кадра в анимации
 */

export const animationFramesParser = frameNames => animName => {
  const preparedFrameNames = frameNames
    // отфильтровываем кадры типа animName
    .filter(frameName => frameName.indexOf(animName) >= 0)
    // разбиваем строку, согласно описанному выше соглашению
    .map(frameName => frameName.split('_'))
    // формируем массив объектов, в формате для дальнейшей обработки
    .map(frameName => [
      frameName[0], // name
      Number(frameName[1]), // number
      Number(frameName[2]) // index
    ])

  let result = []

  preparedFrameNames
    // выбираем номера анимаций
    .map(frameName => frameName[1])
    // оставляем только уникальные
    .filter((animNumber, i, aminNumbers) => {
      return aminNumbers.indexOf(animNumber) === i
    })
    // группируем кадры по номерам анимаций
    .map(animNumber => result.push(
      preparedFrameNames
        // фильтруем все анимации по итерируемому номеру
        .filter(frameName => frameName[1] === animNumber)
        // собираем строковое значение для Phaser'а
        .map(frameName => frameName.join('_'))
    ))

  return result
}
