export default {
  gameWidth: 768,
  gameHeight: 352,
  tileSize: 32,

  bg: {
    color: '#5d5b6a'
  },

  gravity: { y: 2000 },

  initialSpeed: 100,

  player: {
    startPosition: { x: 360, y: 264 },
    jumpSpeed: { x: 0, y: 600 }
  },

  ground: {
    height: { min: 1, max: 4 }
  }
}
