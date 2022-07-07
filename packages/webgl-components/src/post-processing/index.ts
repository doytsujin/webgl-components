import { WebGLRenderer } from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { GraphicsSettings } from '../graphics/quality-settings';
require('lil-gui');
import GUI from 'lil-gui';

/**
 * Post processing manager
 *
 * @export
 * @class PostProcessing
 */
export default class PostProcessing {
  gui!: GUI;
  composer: EffectComposer;

  constructor(renderer: WebGLRenderer, graphicsSettings: GraphicsSettings, gui: GUI | null) {
    if (gui instanceof GUI) {
      this.gui = gui.addFolder('post processing');
      this.gui.open();
    }

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
