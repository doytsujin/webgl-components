import { WebGLRenderer } from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader';
import { GraphicsSettings } from '../graphics/quality-settings';
import TransitionPass, { SceneInterface } from './passes/transition-pass';

const GUI = require('lil-gui');

/**
 * Post processing manager
 *
 * @export
 * @class PostProcessing
 */
export default class PostProcessing {
  gui: typeof GUI;
  composer: EffectComposer;
  transitionPass: TransitionPass;
  fxaaPass: ShaderPass;
  sceneA!: SceneInterface;
  sceneB!: SceneInterface;

  constructor(renderer: WebGLRenderer, graphicsSettings: GraphicsSettings, gui: typeof GUI | null) {
    this.gui = gui.addFolder('post processing');
    this.gui.open();

    const { pixelRatio } = graphicsSettings;
    this.composer = new EffectComposer(renderer);
    this.composer.setPixelRatio(pixelRatio);

    this.fxaaPass = new ShaderPass(FXAAShader);
    this.fxaaPass.renderToScreen = true;

    this.composer.addPass(this.fxaaPass);

    this.gui.add(this.fxaaPass, 'enabled').name('fxaa');
  }

  /**
   * Resize handler
   *
   * @memberof PostProcessing
   */
  resize(width: number, height: number) {
    this.fxaaPass.material.uniforms.resolution.value.x = 1 / width;
    this.fxaaPass.material.uniforms.resolution.value.y = 1 / height;
    this.composer.setSize(width, height);
  }

  /**
   * Render
   *
   * @param {number} delta
   * @memberof PostProcessing
   */
  render(delta: number) {
    this.composer.render(delta);
  }
}
