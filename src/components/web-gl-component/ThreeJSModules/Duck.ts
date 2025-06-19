import { AnimationAction, AnimationMixer, Group, Mesh } from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import * as THREE from 'three';

export default class Duck extends Group {
    mixer?: AnimationMixer;
    glTFLoader: GLTFLoader;

    constructor() {
        super();
        this.glTFLoader = new GLTFLoader();
    }

    async init(animationActions: { [key: string]: AnimationAction }) {
        const [
            duck,
            idle,
            idleToLay,
            lay,
            layToIdle,
            run,
            runLeft,
            runRight,
            walk,
            walkLeft,
            walkRight,
        ] = await Promise.all([
            this.glTFLoader.loadAsync('models/Duck_Anim_Eat.glb'),
            this.glTFLoader.loadAsync('models/Duck_Anim_Idle.glb'),
            this.glTFLoader.loadAsync('models/Duck_Anim_IdleToLay.glb'),
            this.glTFLoader.loadAsync('models/Duck_Anim_Lay.glb'),
            this.glTFLoader.loadAsync('models/Duck_Anim_LayToIdle.glb'),
            this.glTFLoader.loadAsync('public/models/Duck_Anim_Run.glb'),
            this.glTFLoader.loadAsync('public/models/Duck_Anim_RunLeft.glb'),
            this.glTFLoader.loadAsync('public/models/Duck_Anim_RunRight.glb'),
            this.glTFLoader.loadAsync('public/models/Duck_Anim_Walk.glb'),
            this.glTFLoader.loadAsync('public/models/Duck_Anim_WalkLeft.glb'),
            this.glTFLoader.loadAsync('public/models/Duck_Anim_WalkRight.glb'),
        ]);
        duck.scene.traverse((m) => {
            if ((m as Mesh).isMesh) {
                const mesh = m as THREE.Mesh;
                mesh.castShadow = true;
            }
        });
        this.mixer = new AnimationMixer(duck.scene);
        animationActions['eat'] = this.mixer
            .clipAction(duck.animations[0])
            .setLoop(THREE.LoopRepeat, Infinity);
        animationActions['idle'] = this.mixer
            .clipAction(idle.animations[0])
            .setLoop(THREE.LoopRepeat, Infinity);
        animationActions['idleToLay'] = this.mixer
            .clipAction(idleToLay.animations[0])
            .setLoop(THREE.LoopRepeat, Infinity);
        animationActions['lay'] = this.mixer
            .clipAction(lay.animations[0])
            .setLoop(THREE.LoopRepeat, Infinity);
        animationActions['layToIdle'] = this.mixer
            .clipAction(layToIdle.animations[0])
            .setLoop(THREE.LoopRepeat, Infinity);
        animationActions['run'] = this.mixer
            .clipAction(run.animations[0])
            .setLoop(THREE.LoopRepeat, Infinity);
        animationActions['runLeft'] = this.mixer
            .clipAction(runLeft.animations[0])
            .setLoop(THREE.LoopRepeat, Infinity);
        animationActions['runRight'] = this.mixer
            .clipAction(runRight.animations[0])
            .setLoop(THREE.LoopRepeat, Infinity);
        animationActions['walk'] = this.mixer
            .clipAction(walk.animations[0])
            .setLoop(THREE.LoopRepeat, Infinity);
        animationActions['walkLeft'] = this.mixer
            .clipAction(walkLeft.animations[0])
            .setLoop(THREE.LoopRepeat, Infinity);
        animationActions['walkRight'] = this.mixer
            .clipAction(walkRight.animations[0])
            .setLoop(THREE.LoopRepeat, Infinity);

        // animationActions['lay'].play();
        this.add(duck.scene);
    }

    update(delta: number) {
        this.mixer?.update(delta);
    }
}
