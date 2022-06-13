import { SpotLight } from 'three';
import LightController from './light-controller';
const GUI = require('lil-gui');

export type SpotLightSettings = {
  color: number;
  intensity: number;
  distance: number;
  angle: number;
  power: number;
  penumbra: number;
  decay: number;
};

const defaultSettings: SpotLightSettings = {
  color: 0xd4d4d4,
  intensity: 0.6,
  distance: 100,
  angle: Math.PI / 3,
  power: Math.PI * 4,
  penumbra: 0,
  decay: 1
};

/**
 * Utility for creating spot lights
 *
 * @export
 * @class SpotLightController
 * @implements {LightController}
 */
export class SpotLightController implements LightController {
  settings: SpotLightSettings = defaultSettings;
  light: SpotLight;
  gui: typeof GUI;
  guiParent: typeof GUI;

  constructor(settings: SpotLightSettings = defaultSettings) {
    this.settings = Object.assign(this.settings, settings);
    this.light = new SpotLight(
      this.settings.color,
      this.settings.intensity,
      this.settings.distance,
      this.settings.angle,
      this.settings.penumbra,
      this.settings.decay
    );
    this.light.power = this.settings.power;
    this.light.position.set(1, 1, 1);
  }

  addGUI(guiParent: typeof GUI) {
    this.guiParent = guiParent;
    this.gui = guiParent.addFolder('spot');
    this.gui.addColor(this.settings, 'color').onChange(this.onChange);
    this.gui.add(this.light, 'intensity', 0, 10);
    this.gui.add(this.light, 'distance', 0, 100);
    this.gui.add(this.light, 'decay', 0, 1);
    this.gui.add(this.light, 'angle', 0, 1);
    this.gui.add(this.light, 'penumbra', 0, 1);
    this.gui.add(this.light, 'power', 0, 2);
    this.gui.addVector3(this.light, 'position', -50, 50, 0.1);
  }

  onChange = () => {
    this.light.color.setHex(this.settings.color);
  };

  dispose() {
    this.guiParent.removeFolder(this.gui.name);
  }
}
