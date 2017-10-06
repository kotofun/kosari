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
      length: 1,
      floor: {
        default: 'Ground',
        Ground: { height: 1 }
      }
    },
    plateau: {
      length: { min: 2, max: 5 }, // width in gameWidth's
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
      length: { min: 2, max: 5 },
      floor: {
        default: 'Ground',
        Ground: { height: 1 },
        Swamp: { p: 15 }
      },
      obstacles: {
        Grave: { p: 15, between: { min: 5 } }
      }
    },
    swampy: {
      length: { min: 2, max: 5 },
      floor: {
        default: 'Ground',
        Ground: { height: 1 },
        Swamp: {
          p: 30,
          inRow: { max: 2 }
        }
      },
      obstacles: {
        Grave: { p: 15, between: { min: 5 } }
      }
    }
  }
}
