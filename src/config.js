export default {
  gameWidth: 512,
  gameHeight: 256,
  localStorageName: 'phaseres6webpack',
  tileSize: 32,
  gravity: { y: 2000 },
  bg: {
    color: '#5d5b6a'
  },
  player: {
    startPosition: { x: 150, y: 100 },
    jumpSpeed: 600
  },
  ground: {
    height: {
      min: 1,
      max: 4
    }
  }
}
