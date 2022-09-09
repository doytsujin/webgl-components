import { AmbientLight } from 'three';
import LightController, { GUI_PRECISION } from './light-controller';
import GUI from 'lil-gui';
import { GUIWrapper } from '../utils/gui';

export type AmbientLightSettings = {
  color: number;
  intensity: number;
};

export type AmbientLightGUISettings = {
  intensity: { min: number; max: number; precision?: number };
};

const defaultSettings: AmbientLightSettings = { color: 0xd4d4d4, intensity: 0.6 };

const defaultGUISettings: AmbientLightGUISettings = {
  intensity: { min: 0, max: 10, precision: GUI_PRECISION }
};

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
  gui!: GUI | GUIWrapper;

  constructor(settings: AmbientLightSettings = defaultSettings) {
    super();
    this.settings = Object.assign(this.settings, settings);
    this.light = new AmbientLight(this.settings.color, this.settings.intensity);
  }

  addGUI(guiParent: GUI | GUIWrapper, guiSettings: AmbientLightGUISettings = defaultGUISettings) {
    this.gui = guiParent.addFolder('ambient');
    this.gui.add(this.light, 'visible');
    this.gui.add(
      this.light,
      'intensity',
      guiSettings.intensity.min,
      guiSettings.intensity.max,
      guiSettings.intensity.precision
    );
    this.gui.addColor(this.settings, 'color').onChange(this.onChange);
  }

  onChange = () => {
    this.light.color.setHex(this.settings.color);
  };

  dispose() {
    this.gui.destroy();
  }
}
