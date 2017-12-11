import Phaser from 'phaser'

import {animationFramesParser} from '../utils'

const _frames = {}
let _isFramesParsed = false

const _parseFrames = (game, cacheName) => {
  if (!_isFramesParsed) {
    // инициализируем парсер анимации
    const parseFrames = animationFramesParser(
      Object.keys(
        // берем все кадры анимаций из подгруженного
        // в кэш спрайтлиста
        game.cache.getFrameData(cacheName)._frameNames
      )
    )

    // парсим кадры для фреймов "живой" анимации
    _frames.live = parseFrames('live')
    // парсим кадры для фреймов анимации уничтожения
    _frames.kill = parseFrames('kill')

    _isFramesParsed = true
  }
}

export default class extends Phaser.Sprite {
  constructor (game) {
    // парсим анимации для травки
    _parseFrames(game, 'grass')

    // выбираем понравившуюся для жизни
    const liveAnimation = game.rnd.pick(_frames.live)
    // и для уничтожения
    const killAnimation = game.rnd.pick(_frames.kill)

    super(game, 0, 0, 'grass', liveAnimation[0])

    // Create killed by default
    this.exists = false
    this.alive = false
    this.visible = false

    this.animations.add('live', liveAnimation)
    this.animations.add('kill', killAnimation)
  }

  damage (...args) {
    // проверяем, живой ли спрайт для атаки
    if (this.health) {
      // убираем все жизни у спрайта
      this.health = 0

      // Воспроизводим анимацию кошения
      this.animations.play('kill', 15, false)

      // т.к. все кадры анимации 64 х 64
      // поставим якорь спрайта посеридине
      //
      // это конечно плохо, но пока сойдет
      this.anchor.setTo(0.5, 1)
    }
  }

  reset (...args) {
    // остановливаем все анимации и сбрасываем их на первый кадр
    this.animations.stop(null, true)

    // восстанавливаем жизнь
    this.health = 1

    // воспроизводим анимацию жизни 
    this.animations.play('live', 15, true)

    // грязный хак для травы — размер кадра анимации кошения больше,
    // чем размер кадра анимации жизни
    this.anchor.setTo(0, 1)

    super.reset(...args)
  }
}
