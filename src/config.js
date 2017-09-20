export default {
  gameWidth: 512,
  gameHeight: 256,
  tileSize: 32,

  bg: {
    color: '#5d5b6a'
  },

  gravity: { y: 2000 },

  initialSpeed: 100,

  player: {
    startPosition: { x: 150, y: 100 },
    jumpSpeed: { x: 0, y: 600 }
  },

  ground: {
    height: { min: 1, max: 4 }
  }
}
