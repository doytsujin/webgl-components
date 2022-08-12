import { DirectionalLight, DirectionalLightHelper } from 'three';
import LightController from './light-controller';
require('lil-gui');
import GUI from 'lil-gui';

export type DirectioalLightSettings = {
  color: number;
  intensity: number;
};

const defaultSettings: DirectioalLightSettings = { color: 0xd4d4d4, intensity: 0.6 };

/**
 * Utility for creating directional lights
 *
 * @export
 * @class DirectionalLightController
 * @implements {LightController}
 */
export default class DirectionalLightController extends LightController {
  settings: DirectioalLightSettings = defaultSettings;
  light: DirectionalLight;
  gui!: GUI;
  helper: DirectionalLightHelper;

  constructor(settings: DirectioalLightSettings = defaultSettings) {
    super();
    this.settings = Object.assign(this.settings, settings);
    this.light = new DirectionalLight(this.settings.color, this.settings.intensity);
    this.light.position.set(1, 1, 1);
    this.helper = new DirectionalLightHelper(this.light);
  }

  addGUI(guiParent: GUI) {
    this.gui = guiParent.addFolder('directional');
    this.gui.addColor(this.settings, 'color').onChange(this.onChange);
    this.gui.add(this.light, 'intensity', 0, 1);
    this.gui.add(this.light.position, 'x', -1, 1, 0.01);
    this.gui.add(this.light.position, 'y', -1, 1, 0.01);
    this.gui.add(this.light.position, 'z', -1, 1, 0.01);
  }

  onChange = () => {
    this.light.color.setHex(this.settings.color);
    this.helper.update();
  };

  dispose() {
    this.gui.destroy();
  }
}
