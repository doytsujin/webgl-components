import { DirectionalLight, DirectionalLightHelper } from 'three';
import LightController from './light-controller';
const GUI = require('lil-gui');

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
export default class DirectionalLightController implements LightController {
  settings: DirectioalLightSettings = defaultSettings;
  light: DirectionalLight;
  gui: typeof GUI;
  guiParent: typeof GUI;
  helper: DirectionalLightHelper;

  constructor(settings: DirectioalLightSettings = defaultSettings) {
    this.settings = Object.assign(this.settings, settings);
    this.light = new DirectionalLight(this.settings.color, this.settings.intensity);
    this.light.position.set(1, 1, 1);
    this.helper = new DirectionalLightHelper(this.light);
  }

  addGUI(guiParent: typeof GUI) {
    this.guiParent = guiParent;
    this.gui = guiParent.addFolder('directional');
    this.gui.addColor(this.settings, 'color').onChange(this.onChange);
    this.gui.add(this.light, 'intensity', 0, 1);
    this.gui.addVector3(this.light, 'position', -1, 1, 0.01);
  }

  onChange = () => {
    this.light.color.setHex(this.settings.color);
    this.helper.update();
  };

  dispose() {
    this.guiParent.removeFolder(this.gui.name);
  }
}
