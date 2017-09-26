export default {
  gameWidth: 768,
  gameHeight: 512,
  tileSize: 32,

  bg: {
    color: '#5d5b6a'
  },

  gravity: { y: 2000 },

  initialSpeed: 100,

  player: {
    startPosition: { x: 360, y: 424 },
    jumpSpeed: { x: 0, y: 600 }
  },

  ground: {
    height: { min: 1, max: 4 }
  }
}
