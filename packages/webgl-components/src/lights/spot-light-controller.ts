import { SpotLight } from 'three';
import LightController from './light-controller';
require('lil-gui');
import GUI from 'lil-gui';

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
export default class SpotLightController extends LightController {
  settings: SpotLightSettings = defaultSettings;
  light: SpotLight;
  gui!: GUI;

  constructor(settings: SpotLightSettings = defaultSettings) {
    super();
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

  addGUI(guiParent: GUI) {
    const range = 50;
    this.gui = guiParent.addFolder('spot');
    this.gui.addColor(this.settings, 'color').onChange(this.onChange);
    this.gui.add(this.light, 'intensity', 0, 10);
    this.gui.add(this.light, 'distance', 0, 100);
    this.gui.add(this.light, 'decay', 0, 1);
    this.gui.add(this.light, 'angle', 0, 1);
    this.gui.add(this.light, 'penumbra', 0, 1);
    this.gui.add(this.light, 'power', 0, 2);
    this.gui.add(this.light.position, 'x', -range, range, 0.01);
    this.gui.add(this.light.position, 'y', -range, range, 0.01);
    this.gui.add(this.light.position, 'z', -range, range, 0.01);
  }

  onChange = () => {
    this.light.color.setHex(this.settings.color);
  };

  dispose() {
    this.gui.destroy();
  }
}
