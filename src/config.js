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
  }
}
