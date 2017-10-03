export default {
  godMode: true,
  gameWidth: 768,
  gameHeight: 288,
  tileSize: 32,

  bg: {
    color: '#5d5b6a'
  },

  gravity: { y: 2900 },

  initialSpeed: 200,

  player: {
    startPosition: { x: 360, y: 192 },
    jumpSpeed: { x: 0, y: 600 }
  },

  chaser: {
    backlogRate: 0.75
  },

  ground: {
    height: { min: 1, max: 4 }
  },

  terrain: {
    relax: {
      width: 1,
      height: 1
    },
    plateau: {
      width: { min: 2, max: 5 }, // width in gameWidth's
      height: { min: 1, max: 3, breakable: false }, // height in tiles ocunt
      obstacles: {
        grave: { p: 15, between: { min: 3 } }
      }
    },
    habitual: {
      width: { min: 2, max: 5 },
      height: 1,
      floor: { swamp: { p: 15 } },
      obstacles: {
        grave: { p: 15, between: { min: 5 } }
      }
    },
    swampy: {
      width: { min: 2, max: 5 },
      height: 1,
      floor: {
        swamp: {
          p: 30,
          inRow: { max: 2 }
        }
      },
      obstacles: {
        grave: { p: 15, between: { min: 5 } }
      }
    }
  }
}
