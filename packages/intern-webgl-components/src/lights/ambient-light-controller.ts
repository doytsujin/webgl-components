import { AmbientLight } from 'three';
import LightController from './light-controller';
const GUI = require('lil-gui');

export type AmbientLightSettings = {
  color: number;
  intensity: number;
};

const defaultSettings: AmbientLightSettings = { color: 0xd4d4d4, intensity: 0.6 };

/**
 * Utility for creating ambient lights
 *
 * @export
 * @class AmbientLightController
 * @implements {LightController}
 */
export default class AmbientLightController extends LightController {
  light: AmbientLight;
  settings: AmbientLightSettings = defaultSettings;
  gui: typeof GUI;
  guiParent: typeof GUI;

  constructor(settings: AmbientLightSettings = defaultSettings) {
    super();
    this.settings = Object.assign(this.settings, settings);
    this.light = new AmbientLight(this.settings.color, this.settings.intensity);
  }

  addGUI(guiParent: typeof GUI) {
    this.guiParent = guiParent;
    this.gui = guiParent.addFolder('ambient');
    this.gui.add(this.light, 'intensity', 0, 1);
    this.gui.addColor(this.settings, 'color').onChange(this.onChange);
  }

  onChange = () => {
    this.light.color.setHex(this.settings.color);
  };

  dispose() {
    this.guiParent.removeFolder(this.gui.name);
  }
}
