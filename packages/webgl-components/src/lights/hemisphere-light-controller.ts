import { LightController } from '@jam3/webgl-components/lights';
import GUI from 'lil-gui';
import { HemisphereLight, HemisphereLightHelper } from 'three';
import { GUIWrapper } from '../utils/gui';
import { GUI_PRECISION } from './light-controller';

export type HemisphereLightLightSettings = {
  skyColor: number;
  groundColor: number;
  intensity: number;
  helperSize: number;
};

export type HemisphereLightLightGUISettings = {
  intensity: { min: number; max: number; precision?: number };
};

const defaultSettings: HemisphereLightLightSettings = {
  skyColor: 0xffffbb,
  groundColor: 0x080820,
  intensity: 1,
  helperSize: 1
};

const defaultGUISettings: HemisphereLightLightGUISettings = {
  intensity: { min: 0, max: 10, precision: GUI_PRECISION }
};

/**
 * Utility for creating hemisphere lights
 *
 * @export
 * @class HemisphereLightController
 * @implements {LightController}
 */
export default class AmbientLightController extends LightController {
  light: HemisphereLight;
  helper: HemisphereLightHelper;
  settings: HemisphereLightLightSettings = defaultSettings;
  gui!: GUI | GUIWrapper;

  constructor(settings: HemisphereLightLightSettings = defaultSettings) {
    super();
    this.settings = Object.assign(this.settings, settings);
    this.light = new HemisphereLight(this.settings.skyColor, this.settings.groundColor, this.settings.intensity);
    this.helper = new HemisphereLightHelper(this.light, this.settings.helperSize);
  }

  addGUI(guiParent: GUI | GUIWrapper, guiSettings: HemisphereLightLightGUISettings = defaultGUISettings) {
    this.gui = guiParent.addFolder('hemisphere');
    this.gui.add(this.light, 'visible');
    this.gui.add(
      this.light,
      'intensity',
      guiSettings.intensity.min,
      guiSettings.intensity.max,
      guiSettings.intensity.precision
    );
    this.gui.addColor(this.settings, 'skyColor').onChange(this.onChange);
    this.gui.addColor(this.settings, 'groundColor').onChange(this.onChange);
  }

  onChange = () => {
    this.light.color.setHex(this.settings.skyColor);
    this.light.groundColor.setHex(this.settings.groundColor);
  };

  dispose() {
    this.gui.destroy();
  }
}
