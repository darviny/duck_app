import { AnimationAction, Scene } from 'three/src/Three.js';
// import { getIntersects } from './rayCastUtils.js';
import { DuckStates } from './enums/DuckStates.js';
import Duck from './Duck';
import { GUI } from 'lil-gui';
import * as THREE from 'three';

export default class AnimationController {
    scene: Scene;
    wait = false;
    animationActions: { [key: string]: AnimationAction } = {};
    activeAction?: AnimationAction;
    nextAction?: DuckStates;
    speed = 0;
    model?: Duck;
    gui?: GUI;

    private targetY?: number;
    private yLerpSpeed = 0.05;

    constructor(scene: Scene) {
        this.scene = scene;
    }

    async init() {
        this.model = new Duck();
        this.model.scale.set(5, 5, 5);
        this.model.rotateY(-Math.PI / 2);
        this.model.position.set(0, 0.25, 0);
        this.activeAction = this.animationActions['lay'];
        await this.model.init(this.animationActions);
        this.scene.add(this.model);

        this.nextAction = DuckStates.IDLE;

        // GUI
        this.gui = new GUI();
        const duckStates = this.gui.addFolder('Duck States');

        duckStates.add(this, 'nextAction', {
            idle: DuckStates.IDLE,
            eat: DuckStates.EAT,
            lay: DuckStates.LAY,
        });
    }

    setAction(action: AnimationAction) {
        if (this.activeAction !== action) {
            this.activeAction?.fadeOut(1);
            action.reset().fadeIn(1).play();
            this.activeAction = action;
        }
    }

    update(delta: number) {
        if (!this.wait) {
            let actionAssigned = false;

            if (!actionAssigned && this.nextAction == DuckStates.LAY) {
                const idleToLayAction = this.animationActions['idleToLay'];
                const layAction = this.animationActions['lay'];

                switch (this.activeAction) {
                    case this.animationActions['idle']:
                        if (idleToLayAction && layAction) {
                            this.wait = true; // Block further transitions immediately
                            this.activeAction?.fadeOut(1);
                            idleToLayAction.reset();
                            idleToLayAction.setLoop(THREE.LoopOnce, 1);
                            idleToLayAction.clampWhenFinished = true;
                            idleToLayAction.fadeIn(1).play();
                            this.activeAction = idleToLayAction;
                            actionAssigned = true;
                            if (this.model) {
                                this.targetY = this.model.position.y - 0.25;
                            }

                            // When idleToLay finishes, play lay (looping)
                            const onIdleToLayFinished = () => {
                                idleToLayAction
                                    .getMixer()
                                    .removeEventListener('finished', onIdleToLayFinished);
                                layAction.reset();
                                layAction.setLoop(THREE.LoopRepeat, Infinity);
                                layAction.clampWhenFinished = false;
                                layAction.fadeIn(1).play();
                                this.activeAction = layAction;
                                this.wait = false;
                            };
                            idleToLayAction
                                .getMixer()
                                .addEventListener('finished', onIdleToLayFinished);
                        }
                        break;
                    default:
                        if (this.activeAction !== layAction) {
                            this.setAction(layAction);
                            actionAssigned = true;
                        }
                }
            }

            if (!actionAssigned && this.nextAction == DuckStates.IDLE) {
                const layToIdleAction = this.animationActions['layToIdle'];
                const idleAction = this.animationActions['idle'];

                switch (this.activeAction) {
                    case this.animationActions['lay']:
                        if (layToIdleAction && idleAction) {
                            this.wait = true;
                            this.activeAction?.fadeOut(1);
                            layToIdleAction.reset();
                            layToIdleAction.setLoop(THREE.LoopOnce, 1);
                            layToIdleAction.clampWhenFinished = true;
                            layToIdleAction.fadeIn(1).play();
                            this.activeAction = layToIdleAction;
                            actionAssigned = true;
                            if (this.model) {
                                this.targetY = this.model.position.y + 0.25;
                            }

                            const onLayToIdleActionFinished = () => {
                                layToIdleAction
                                    .getMixer()
                                    .removeEventListener('finished', onLayToIdleActionFinished);
                                idleAction.reset();
                                idleAction.setLoop(THREE.LoopRepeat, Infinity);
                                idleAction.clampWhenFinished = false;
                                idleAction.fadeIn(1).play();
                                this.activeAction = idleAction;
                                this.wait = false;
                            };

                            layToIdleAction
                                .getMixer()
                                .addEventListener('finished', onLayToIdleActionFinished);
                        }
                        break;
                    default:
                        if (this.activeAction !== idleAction) {
                            this.setAction(idleAction);
                            actionAssigned = true;
                        }
                }
            }

            if (!actionAssigned && this.nextAction == DuckStates.EAT) {
                const eatAction = this.animationActions['eat'];
                if (this.activeAction !== eatAction) {
                    this.setAction(eatAction);
                    actionAssigned = true;
                }
            }
        }

        // Smoothly interpolate Y position if needed
        if (this.model && this.targetY !== undefined) {
            const currentY = this.model.position.y;
            const diff = this.targetY - currentY;
            if (Math.abs(diff) > 0.001) {
                this.model.position.y += diff * this.yLerpSpeed;
            } else {
                this.model.position.y = this.targetY;
                this.targetY = undefined;
            }
        }

        // Always update the mixer
        this.model?.update(delta);
    }

    setNextAnimationState(nextAction: DuckStates) {
        this.nextAction = nextAction;
    }

}
