export default {
  gameWidth: 640,
  gameHeight: 256,
  localStorageName: 'phaseres6webpack',
  tileSize: 32,
  bg: {
    color: '#5d5b6a'
  },
  player: {
    startPosition: { x: 240, y: 100 }
  },
  ground: {
    height: {
      min: 1,
      max: 4
    },
    width: {
      min: 2,
      max: 10
    }
  },
  gaps: {
    width: {
      min: 1,
      max: 4
    }
  }
}
