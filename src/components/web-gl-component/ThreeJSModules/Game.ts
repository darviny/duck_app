import { PerspectiveCamera, Scene, WebGLRenderer } from 'three'
import Player from './Player.js'
import Environment from './Environment.js'
export default class Game {
  scene: Scene
  camera: PerspectiveCamera
  renderer: WebGLRenderer
  player?: Player
  environment?: Environment

  constructor(scene: Scene, camera: PerspectiveCamera, renderer: WebGLRenderer) {
    this.scene = scene
    this.camera = camera
    this.renderer = renderer
  }

  async init() {

    this.player = new Player(this.scene)
    await this.player.init()

    this.environment = new Environment(this.scene)
    await this.environment.init()
  }

  update(delta: number) {
    this.player?.update(delta)
    this.environment?.animate();
  }
}