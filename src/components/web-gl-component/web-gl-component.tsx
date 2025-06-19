import styles from './web-gl-component.module.scss';
// import cx from 'classnames';
import * as THREE from 'three';
import { useEffect, useRef, useState, useCallback } from 'react';
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
    aiEvaluation?: {
        clarity: number;
        accuracy: number;
        engagement: number;
        suggestions: string[];
        evidence: string[];
        overall_comment: string;
    };
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const WebGLComponent = ({ nextState, aiEvaluation }: WebGLComponentProps) => {
    const refContainer = useRef<HTMLDivElement>(null);
    const [progress1, setProgress1] = useState(0);
    const [progress2, setProgress2] = useState(0);
    const [progress3, setProgress3] = useState(0);
    const [progressPosition, setProgressPosition] = useState({ top: 20, left: 20, right: 20 });

    // Calculate reactive position for progress bars
    const updateProgressPosition = useCallback(() => {
        const container = refContainer.current;
        if (!container) return;

        const containerRect = container.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const viewportWidth = window.innerWidth;
        
        // Calculate responsive positioning - bottom placement
        const bottom = Math.max(1, 0);
        const top = containerRect.height - bottom - 100; // 120px for 3 progress bars + gaps
        const left = Math.max(20, containerRect.width * 0.05);
        const right = Math.max(20, containerRect.width * 0.05);
        
        setProgressPosition({ top, left, right });
    }, []);

    // Update position on mount and resize
    useEffect(() => {
        updateProgressPosition();
        window.addEventListener('resize', updateProgressPosition);
        return () => window.removeEventListener('resize', updateProgressPosition);
    }, [updateProgressPosition]);

    // Use AI evaluation data if available, otherwise use animated values
    useEffect(() => {
        if (aiEvaluation) {
            // Animate to new AI values smoothly
            const animateToValue = (currentValue: number, targetValue: number, setter: (value: number) => void) => {
                const duration = 1000; // 1 second animation
                const startTime = Date.now();
                const startValue = currentValue;
                const change = targetValue - startValue;
                
                const animate = () => {
                    const elapsed = Date.now() - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    
                    // Easing function for smooth animation
                    const easeOutQuart = 1 - Math.pow(1 - progress, 4);
                    const currentValue = startValue + (change * easeOutQuart);
                    
                    setter(currentValue);
                    
                    if (progress < 1) {
                        requestAnimationFrame(animate);
                    }
                };
                
                animate();
            };
            
            animateToValue(progress1, aiEvaluation.clarity, setProgress1);
            animateToValue(progress2, aiEvaluation.accuracy, setProgress2);
            animateToValue(progress3, aiEvaluation.engagement, setProgress3);
        } else {
            // Fallback to animated values when no AI data is available
            const interval1 = setInterval(() => {
                setProgress1(prev => {
                    if (prev >= 85) return 85;
                    return prev + 1;
                });
            }, 100);

            const interval2 = setInterval(() => {
                setProgress2(prev => {
                    if (prev >= 92) return 92;
                    return prev + 1.5;
                });
            }, 80);

            const interval3 = setInterval(() => {
                setProgress3(prev => {
                    if (prev >= 78) return 78;
                    return prev + 1.2;
                });
            }, 90);

            return () => {
                clearInterval(interval1);
                clearInterval(interval2);
                clearInterval(interval3);
            };
        }
    }, [aiEvaluation]);

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
        const renderPass = new RenderPass(scene, camera);
        composer.addPass(renderPass);
        // composer.addPass(new RenderPixelatedPass(renderResolution, scene, camera));
        const bloomPass = new UnrealBloomPass(screenResolution, 0.3, 0.4, 1);
        composer.addPass(bloomPass);
        const pixelatePass = new PixelatePass(renderResolution);
        composer.addPass(pixelatePass);

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
            // Cancel animation frame
            if (animationId) {
                cancelAnimationFrame(animationId);
            }

            // Remove event listeners
            window.removeEventListener('resize', handleResize);

            // Dispose of controls
            controls.dispose();

            // Dispose of post-processing passes
            if (bloomPass) {
                bloomPass.dispose();
            }
            if (pixelatePass && pixelatePass.dispose) {
                pixelatePass.dispose();
            }

            // Dispose of composer
            if (composer) {
                composer.dispose();
            }

            // Dispose of renderer
            if (renderer) {
                renderer.dispose();
            }

            // Remove canvas from DOM
            if (container && renderer.domElement.parentNode === container) {
                container.removeChild(renderer.domElement);
            }

            // Dispose of scene and camera
            if (scene) {
                scene.clear();
            }
        };
    }, [nextState]);

    return (
        <div ref={refContainer} className={styles.webglcomponent}>
            <div 
                className={styles.progressOverlay}
                style={{
                    top: `${progressPosition.top}px`,
                    left: `${progressPosition.left}px`,
                    right: `${progressPosition.right}px`
                }}
            >
                <div className={styles.progressBar}>
                    <div className={styles.progressLabel}>Clarity</div>
                    <div className={styles.progressTrack}>
                        <div 
                            className={styles.progressFill} 
                            style={{ width: `${progress1}%` }}
                        ></div>
                    </div>
                    <div className={styles.progressValue}>{Math.round(progress1)}%</div>
                </div>
                
                <div className={styles.progressBar}>
                    <div className={styles.progressLabel}>Accuracy</div>
                    <div className={styles.progressTrack}>
                        <div 
                            className={styles.progressFill} 
                            style={{ width: `${progress2}%` }}
                        ></div>
                    </div>
                    <div className={styles.progressValue}>{Math.round(progress2)}%</div>
                </div>
                
                <div className={styles.progressBar}>
                    <div className={styles.progressLabel}>Engagement</div>
                    <div className={styles.progressTrack}>
                        <div 
                            className={styles.progressFill} 
                            style={{ width: `${progress3}%` }}
                        ></div>
                    </div>
                    <div className={styles.progressValue}>{Math.round(progress3)}%</div>
                </div>
            </div>
        </div>
    );
};
