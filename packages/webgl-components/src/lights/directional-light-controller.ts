import { DirectionalLight, DirectionalLightHelper } from 'three';
import LightController, { GUI_PRECISION } from './light-controller';
import GUI from 'lil-gui';
import { GUIWrapper } from '../utils/gui';

export type DirectioalLightSettings = {
  color: number;
  intensity: number;
  helperSize: number;
};

export type DirectionalLightGUISettings = {
  intensity: { min: number; max: number; precision?: number };
  position: {
    x: { min: number; max: number };
    y: { min: number; max: number };
    z: { min: number; max: number };
    precision: number;
  };
};

const defaultGUISettings: DirectionalLightGUISettings = {
  intensity: { min: 0, max: 10, precision: GUI_PRECISION },
  position: {
    x: { min: -1, max: 1 },
    y: { min: -1, max: 1 },
    z: { min: -1, max: 1 },
    precision: GUI_PRECISION
  }
};

const defaultSettings: DirectioalLightSettings = { color: 0xd4d4d4, intensity: 0.6, helperSize: 1 };

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
  gui!: GUI | GUIWrapper;
  helper: DirectionalLightHelper;

  constructor(settings: DirectioalLightSettings = defaultSettings) {
    super();
    this.settings = Object.assign(this.settings, settings);
    this.light = new DirectionalLight(this.settings.color, this.settings.intensity);
    this.light.position.set(1, 1, 1);
    this.helper = new DirectionalLightHelper(this.light, this.settings.helperSize);
    this.helpers.add(this.helper);
  }

  addGUI(guiParent: GUI | GUIWrapper, guiSettings: DirectionalLightGUISettings = defaultGUISettings) {
    this.gui = guiParent.addFolder('directional');
    this.gui.add(this.light, 'visible');
    this.gui.addColor(this.settings, 'color').onChange(this.onChange);
    this.gui.add(
      this.light,
      'intensity',
      guiSettings.intensity.min,
      guiSettings.intensity.max,
      guiSettings.intensity.precision
    );
    this.gui.add(
      this.light.position,
      'x',
      guiSettings.position.x.min,
      guiSettings.position.x.max,
      guiSettings.position.precision
    );
    this.gui.add(
      this.light.position,
      'y',
      guiSettings.position.y.min,
      guiSettings.position.y.max,
      guiSettings.position.precision
    );
    this.gui.add(
      this.light.position,
      'z',
      guiSettings.position.z.min,
      guiSettings.position.z.max,
      guiSettings.position.precision
    );
  }

  onChange = () => {
    this.light.color.setHex(this.settings.color);
    this.helper.update();
  };

  dispose() {
    this.gui.destroy();
  }
}
