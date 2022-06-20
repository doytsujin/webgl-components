import { WebGLRenderer } from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { GraphicsSettings } from '../graphics/quality-settings';

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

  constructor(renderer: WebGLRenderer, graphicsSettings: GraphicsSettings, gui: typeof GUI | null) {
    this.gui = gui.addFolder('post processing');
    this.gui.open();

    const { pixelRatio } = graphicsSettings;
    this.composer = new EffectComposer(renderer);
    this.composer.setPixelRatio(pixelRatio);
  }

  /**
   * Resize handler
   *
   * @memberof PostProcessing
   */
  resize(width: number, height: number) {
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
