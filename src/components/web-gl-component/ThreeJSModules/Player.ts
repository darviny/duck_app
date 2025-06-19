import { Euler, Matrix4, Object3D, Quaternion, Scene, Vector3 } from 'three'
import AnimationController from './AnimationController'

export default class Player {
  scene: Scene
  animationController?: AnimationController
  vector = new Vector3()
  inputVelocity = new Vector3()
  euler = new Euler()
  quaternion = new Quaternion()
  followTarget = new Object3D() //new Mesh(new SphereGeometry(0.1), new MeshNormalMaterial())
  grounded = true
  rotationMatrix = new Matrix4()
  targetQuaternion = new Quaternion()
  wait = false

  constructor(
    scene: Scene,
  ) {
    this.scene = scene
  }

  async init() {
    this.animationController = new AnimationController(this.scene)
    await this.animationController.init()
  }


  update(delta: number) {
    this.animationController?.update(delta)
  }
}