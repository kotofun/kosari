export default {
  gameWidth: 768,
  gameHeight: 288,
  tileSize: 32,

  bg: {
    color: '#5d5b6a'
  },

  gravity: { y: 2000 },

  initialSpeed: 200,

  player: {
    startPosition: { x: 360, y: 196 },
    jumpSpeed: { x: 0, y: 600 }
  },

  ground: {
    height: { min: 1, max: 4 }
  }
}
