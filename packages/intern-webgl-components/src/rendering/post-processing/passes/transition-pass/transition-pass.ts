import { Camera, Scene, ShaderMaterial, Vector2, WebGLRenderer, WebGLRenderTarget } from 'three';
import { FullScreenQuad, Pass } from 'three/examples/jsm/postprocessing/Pass';
import gsap from 'gsap';
import { vertexShader, fragmentShader } from './shader.glsl'
import { createRenderTarget } from '../../../render-target'

const GUI = require('lil-gui');

export interface SceneInterface {
  cameras: { main: Camera, debug: Camera | null };
  scene: Scene,
  clearColor: 0x000000;
  update(delta: number): any;
}

/**
 * Transition pass handles transitioning between two scenes
 *
 * @export
 * @class TransitionPass
 * @extends {Pass}
 */
export default class TransitionPass extends Pass {
  fsQuad: FullScreenQuad;
  material: ShaderMaterial;
  renderTargetA: WebGLRenderTarget;
  renderTargetB: WebGLRenderTarget;
  sceneA!: SceneInterface;
  sceneB!: SceneInterface;
  gui!: typeof GUI;
  skipTransitions: boolean;

  constructor(renderBufferSize: Vector2, skipTransition = false, gui: typeof GUI) {
    super();
    this.gui = gui.addFolder('transition-pass');
    this.gui.open();
    this.material = new ShaderMaterial({
      uniforms: {
        texture0: {
          value: null
        },
        texture1: {
          value: null
        },
        transition: {
          value: 0
        }
      },
      vertexShader,
      fragmentShader
    });
    this.fsQuad = new FullScreenQuad(this.material);
    const { width, height } = renderBufferSize;
    this.renderTargetA = createRenderTarget(width, height);
    this.renderTargetB = createRenderTarget(width, height);

    this.skipTransitions = skipTransition;
    this.gui.add(this.material.uniforms.transition, 'value', 0, 1).name('transition').listen();
  }

  /**
   * Transition activates this pass and blends from sceneA to sceneB
   *
   * @memberof TransitionPass
   */
  async transition() {
    return new Promise((resolve) => {
      if (this.skipTransitions) {
        this.material.uniforms.transition.value = 1;
        resolve(null);
      } else {
        this.material.uniforms.transition.value = 0;
        gsap.killTweensOf(this.material.uniforms.transition);
        gsap.to(this.material.uniforms.transition, {
          duration: 1,
          value: 1,
          onComplete: () => resolve(null)
        });
      }
    });
  }

  /**
   * Render scene logic based on the transition value
   *
   * @param {WebGLRenderer} renderer
   * @param {WebGLRenderTarget} writeBuffer
   * @param {number} deltaTime
   * @memberof TransitionPass
   */
  renderScene(renderer: WebGLRenderer, writeBuffer: WebGLRenderTarget, deltaTime: number) {
    const transition = this.material.uniforms.transition.value;
    if (transition > 0 && transition < 1) {
      this.sceneA.update(deltaTime);
      this.sceneB.update(deltaTime);
      renderer.setClearColor(this.sceneA.clearColor);
      renderer.setRenderTarget(this.renderTargetA);
      renderer.render(this.sceneA.scene, this.sceneA.cameras.main);
      renderer.setClearColor(this.sceneB.clearColor);
      renderer.setRenderTarget(this.renderTargetB);
      renderer.render(this.sceneB.scene, this.sceneB.cameras.main);
      this.material.uniforms.texture0.value = this.renderTargetA.texture;
      this.material.uniforms.texture1.value = this.renderTargetB.texture;
      renderer.setRenderTarget(this.renderToScreen ? null : writeBuffer);
      this.fsQuad.render(renderer);
    } else if (transition === 0) {
      this.sceneA.update(deltaTime);
      renderer.setClearColor(this.sceneA.clearColor);
      renderer.setRenderTarget(this.renderToScreen ? null : writeBuffer);
      renderer.render(this.sceneA.scene, this.sceneA.cameras.main);
    } else {
      this.sceneB.update(deltaTime);
      renderer.setClearColor(this.sceneB.clearColor);
      renderer.setRenderTarget(this.renderToScreen ? null : writeBuffer);
      renderer.render(this.sceneB.scene, this.sceneB.cameras.main);
    }
  }

  /**
   * Resize handler
   *
   * @param {number} width
   * @param {number} height
   * @memberof TransitionPass
   */
  setSize(width: number, height: number) {
    this.renderTargetA.setSize(width, height);
  }

  /**
   * Set the scenes
   *
   * @param {SceneInterface} sceneA
   * @param {SceneInterface} sceneB
   * @memberof TransitionPass
   */
  setScenes(sceneA: SceneInterface, sceneB: SceneInterface) {
    this.sceneA = sceneA;
    this.sceneB = sceneB;
  }

  /**
   * Render the pass
   *
   * @param {WebGLRenderer} renderer
   * @param {WebGLRenderTarget} writeBuffer
   * @param {WebGLRenderTarget} _readBuffer
   * @param {number} deltaTime
   * @param {boolean} _maskActive
   * @memberof TransitionPass
   */
  render(
    renderer: WebGLRenderer,
    writeBuffer: WebGLRenderTarget,
    _readBuffer: WebGLRenderTarget,
    deltaTime: number,
    _maskActive: boolean
  ) {
    this.renderScene(renderer, writeBuffer, deltaTime);
  }
}
