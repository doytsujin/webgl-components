import { PointLight } from 'three';
import LightController from './light-controller';
const GUI = require('lil-gui');

export type PointLightSettings = {
  color: number;
  intensity: number;
  distance: number;
  decay: number;
};

const defaultSettings: PointLightSettings = {
  color: 0xd4d4d4,
  intensity: 0.6,
  distance: 100,
  decay: 0
};

/**
 * Utility for creating point lights
 *
 * @export
 * @class PointLightController
 * @implements {LightController}
 */
export class PointLightController implements LightController {
  settings: PointLightSettings = defaultSettings;
  light: PointLight;
  gui: typeof GUI;
  guiParent: typeof GUI;

  constructor(settings: PointLightSettings = defaultSettings) {
    this.settings = Object.assign(this.settings, settings);
    this.light = new PointLight(
      this.settings.color,
      this.settings.intensity,
      this.settings.distance,
      this.settings.decay
    );
    this.light.position.set(1, 1, 1);
  }

  addGUI(guiParent: typeof GUI) {
    this.guiParent = guiParent;
    this.gui = guiParent.addFolder('point');
    this.gui.addColor(this.settings, 'color').onChange(this.onChange);
    this.gui.add(this.settings, 'intensity', 0, 10);
    this.gui.add(this.settings, 'distance', 0, 1000);
    this.gui.add(this.settings, 'decay', 0, 1000);
    this.gui.addVector3(this.light, 'position', -50, 50, 0.1);
  }

  onChange = () => {
    this.light.color.setHex(this.settings.color);
  };

  dispose() {
    this.guiParent.removeFolder(this.gui.name);
  }
}
