import * as THREE from "three"
import { WebGLRenderer, WebGLRenderTarget } from "three"
import { Pass, FullScreenQuad } from "three/examples/jsm/postprocessing/Pass.js"

// Just inverts the output.
export default class HelloWorldPass extends Pass {

    fsQuad: FullScreenQuad

    constructor() {
        super()
        this.fsQuad = new FullScreenQuad( this.material() )
    }

    render(
        renderer: WebGLRenderer,
        writeBuffer: WebGLRenderTarget,
        readBuffer: WebGLRenderTarget
    ) {
        // The declarations for Three.js don't include Material.uniforms
        // @ts-expect-error: Three.js Material type does not include 'uniforms' but ShaderMaterial does
        this.fsQuad.material.uniforms.tDiffuse.value = readBuffer.texture
        if ( this.renderToScreen ) {
            renderer.setRenderTarget( null )
        } else {
            renderer.setRenderTarget( writeBuffer )
            if ( this.clear ) renderer.clear()
        }
        this.fsQuad.render( renderer )
    }

    material() {
        // fragment shader modifiers
        return new THREE.ShaderMaterial( {
            uniforms: {
                tDiffuse: { value: null }
            },
            vertexShader:
                `varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
                }`,
            fragmentShader:
                `uniform sampler2D tDiffuse;
                varying vec2 vUv;
                void main() {
                    vec4 texel = texture2D( tDiffuse, vUv );
                    gl_FragColor = 0.75 * texel;
                }`
        } )
    }
}