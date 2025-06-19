import styles from './web-gl-component.module.scss';
// import cx from 'classnames';
import * as THREE from 'three';
import { useEffect, useRef } from 'react';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import Game from './ThreeJSModules/Game.js';

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

import PixelatePass from './post-processing/PixelatePass';

import { Vector2 } from 'three';
import { DuckStates } from './ThreeJSModules/enums';

export interface WebGLComponentProps {
    nextState?: DuckStates;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const WebGLComponent = ({ nextState }: WebGLComponentProps) => {
    const refContainer = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const container = refContainer.current;
        if (!container) return;

        const screenResolution = new Vector2(container.clientWidth, container.clientHeight);
        const renderResolution = screenResolution.clone().divideScalar(6);
        renderResolution.x |= 0;
        renderResolution.y |= 0;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(
            50,
            container.clientWidth / container.clientHeight,
            0.1,
            1000
        );
        camera.position.set(1.5, 0.75, 2);
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(container.clientWidth, container.clientHeight);
        container.appendChild(renderer.domElement);

        // Post-processing
        const composer = new EffectComposer(renderer);
        composer.addPass(new RenderPass(scene, camera));
        // composer.addPass(new RenderPixelatedPass(renderResolution, scene, camera));
        const bloomPass = new UnrealBloomPass(screenResolution, 0.3, 0.4, 1);
        composer.addPass(bloomPass);
        composer.addPass(new PixelatePass(renderResolution));

        // Controls
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enablePan = false;
        controls.enableZoom = false;
        controls.minPolarAngle = 1.1;
        controls.maxPolarAngle = 1.45;
        controls.enableDamping = true;
        controls.dampingFactor = 0.1;
        controls.target.set(0, 1.5, 0);

        // Camera
        camera.position.set(-7, 3, 7);
        camera.lookAt(controls.target);
        camera.setFocalLength(65);

        const handleResize = () => {
            if (!container) return;
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        };
        window.addEventListener('resize', handleResize);

        const game = new Game(scene, camera, renderer);
        game.init();

        let animationId: number;
        const clock = new THREE.Clock();
        let delta = 0;

        function animate() {
            animationId = requestAnimationFrame(animate);

            delta = clock.getDelta();

            controls.update();
            game.update(delta);

            composer.render();

            if (nextState) {
                game.player?.animationController?.setNextAnimationState(nextState);
            }
        }

        animate();

        // Cleanup function
        return () => {
            window.removeEventListener('resize', handleResize);
            if (container && renderer.domElement.parentNode === container) {
                container.removeChild(renderer.domElement);
            }
            cancelAnimationFrame(animationId);
            renderer.dispose();
        };
    }, [nextState]);
    return (
        <div ref={refContainer} className={styles.webglcomponent}>
            {' '}
        </div>
    );
};
