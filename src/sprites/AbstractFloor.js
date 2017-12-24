import Phaser from 'phaser'
import AbstractObjectPool from '../pool/AbstractObjectPool'

export default class extends Phaser.Sprite {
  constructor (...args) {
    super(...args)

    this.game.physics.arcade.enable(this)
    this.body.allowGravity = false
    this.body.immovable = true
  }

  init(){
    this.body.setSize(this.width, this.height)
  }
}