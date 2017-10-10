const gameWidth = 768
const gameHeight = 288
const tileSize = 32

const pxToTiles = px => Math.ceil(px / tileSize)
const tilesToPx = tiles => tiles * tileSize

const gameWidthInTiles = pxToTiles(gameWidth)
const gameHeightInTiles = pxToTiles(gameHeight)

const gameScreensPx = screensCount => gameWidth * screensCount
const gameScreensTiles = screensCount => gameWidthInTiles * screensCount

export default {
  godMode: true,

  gameWidth,
  gameHeight,
  gameWidthInTiles,
  gameHeightInTiles,
  tileSize,

  bg: { color: '#5d5b6a' },

  gravity: { y: 2900 },

  initialSpeed: 200,

  player: {
    startPosition: { x: 360, y: 0 },
    jumpSpeed: { x: 0, y: 600 }
  },

  chaser: {
    backlogRate: 0.75
  },

  ground: {
    height: { min: 1, max: 4 }
  },

  obstacle: {
    Grave: { max: 10 }
  },

  terrain: {
    relax: {
      p: 30,
      length: { min: gameScreensTiles(1), max: gameScreensTiles(1) },
      floor: {
        default: 'Ground',
        Ground: { height: 1 }
      }
    },
    plateau: {
      p: 30,
      length: { min: gameScreensTiles(2), max: gameScreensTiles(5) }, // width in gameWidth's
      floor: {
        default: 'Ground',
        Ground: {
          height: { // height in tiles ocunt
            min: 1,
            max: 3,
            breakable: false
          }
        }
      },
      obstacles: {
        Grave: { p: 15, between: { min: 3 } }
      },
      enemies: {
        Bat: { p: 10 },
        Skeleton: { p: 5 }
      }
    },
    habitual: {
      p: 30,
      length: { min: gameScreensTiles(2), max: gameScreensTiles(5) },
      floor: {
        default: 'Ground',
        Ground: { height: 1 },
        Swamp: { p: 15, inRow: { max: 2 } }
      },
      obstacles: {
        Grave: { p: 15, between: { min: 5 } }
      }
    },
    swampy: {
      p: 30,
      length: { min: gameScreensTiles(2), max: gameScreensTiles(5) },
      floor: {
        default: 'Ground',
        Ground: { height: 1 },
        Swamp: { p: 30, inRow: { max: 2 } }
      },
      obstacles: {
        Grave: { p: 15, between: { min: 5 } }
      }
    }
  }
}
