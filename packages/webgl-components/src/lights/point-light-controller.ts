import { PointLight } from 'three';
import LightController, { GUI_PRECISION } from './light-controller';
import GUI from 'lil-gui';
import { GUIWrapper } from '../utils/gui';

export type PointLightSettings = {
  color: number;
  intensity: number;
  distance: number;
  decay: number;
};

export type PointLightGUISettings = {
  intensity: { min: number; max: number; precision?: number };
  distance: { min: number; max: number; precision?: number };
  decay: { min: number; max: number; precision?: number };
  position: {
    x: { min: number; max: number };
    y: { min: number; max: number };
    z: { min: number; max: number };
    precision?: number;
  };
};

const defaultSettings: PointLightSettings = {
  color: 0xd4d4d4,
  intensity: 0.6,
  distance: 100,
  decay: 0
};

const defaultGUISettings: PointLightGUISettings = {
  intensity: { min: 0, max: 10, precision: GUI_PRECISION },
  distance: { min: 0, max: 1000, precision: GUI_PRECISION },
  decay: { min: 0, max: 1000, precision: GUI_PRECISION },
  position: {
    x: { min: 0, max: 1000 },
    y: { min: 0, max: 1000 },
    z: { min: 0, max: 1000 },
    precision: GUI_PRECISION
  }
};

/**
 * Utility for creating point lights
 *
 * @export
 * @class PointLightController
 * @implements {LightController}
 */
export default class PointLightController extends LightController {
  settings: PointLightSettings = defaultSettings;
  light: PointLight;
  gui!: GUI | GUIWrapper;

  constructor(settings: PointLightSettings = defaultSettings) {
    super();
    this.settings = Object.assign(this.settings, settings);
    this.light = new PointLight(
      this.settings.color,
      this.settings.intensity,
      this.settings.distance,
      this.settings.decay
    );
    this.light.position.set(1, 1, 1);
  }

  addGUI(guiParent: GUI | GUIWrapper, guiSettings: PointLightGUISettings = defaultGUISettings) {
    this.gui = guiParent.addFolder('point');
    this.gui.add(this.light, 'visible');
    this.gui.addColor(this.settings, 'color').onChange(this.onChange);
    this.gui.add(
      this.settings,
      'intensity',
      guiSettings.intensity.min,
      guiSettings.intensity.max,
      guiSettings.intensity.precision
    );
    this.gui.add(
      this.settings,
      'distance',
      guiSettings.distance.min,
      guiSettings.distance.max,
      guiSettings.distance.precision
    );
    this.gui.add(this.settings, 'decay', guiSettings.decay.min, guiSettings.decay.max, guiSettings.decay.precision);
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
  };

  dispose() {
    this.gui.destroy();
  }
}
