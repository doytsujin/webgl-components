import { SpotLight } from 'three';
import LightController, { GUI_PRECISION } from './light-controller';
import GUI from 'lil-gui';
import { GUIWrapper } from '../utils/gui';

export type SpotLightSettings = {
  color: number;
  intensity: number;
  distance: number;
  angle: number;
  power: number;
  penumbra: number;
  decay: number;
};

export type SpotLightGUISettings = {
  intensity: { min: number; max: number; precision: number };
  distance: { min: number; max: number; precision: number };
  decay: { min: number; max: number; precision: number };
  angle: { min: number; max: number; precision: number };
  penumbra: { min: number; max: number; precision: number };
  power: { min: number; max: number; precision: number };
  range: {
    x: { min: number; max: number };
    y: { min: number; max: number };
    z: { min: number; max: number };
    precision: number;
  };
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

const defaultGUISettings: SpotLightGUISettings = {
  intensity: { min: 0, max: 10, precision: GUI_PRECISION },
  distance: { min: 0, max: 100, precision: GUI_PRECISION },
  decay: { min: 0, max: 1, precision: GUI_PRECISION },
  angle: { min: 0, max: 1, precision: GUI_PRECISION },
  penumbra: { min: 0, max: 1, precision: GUI_PRECISION },
  power: { min: 0, max: 2, precision: GUI_PRECISION },
  range: {
    x: { min: -100, max: 100 },
    y: { min: -100, max: 100 },
    z: { min: -100, max: 100 },
    precision: GUI_PRECISION
  }
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
  gui!: GUI | GUIWrapper;

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

  addGUI(guiParent: GUI | GUIWrapper, guiSettings: SpotLightGUISettings = defaultGUISettings) {
    this.gui = guiParent.addFolder('spot');
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
      this.light,
      'distance',
      guiSettings.distance.min,
      guiSettings.distance.max,
      guiSettings.distance.precision
    );
    this.gui.add(this.light, 'decay', guiSettings.decay.min, guiSettings.decay.max, guiSettings.decay.precision);
    this.gui.add(this.light, 'angle', guiSettings.angle.min, guiSettings.angle.max, guiSettings.angle.precision);
    this.gui.add(
      this.light,
      'penumbra',
      guiSettings.penumbra.min,
      guiSettings.penumbra.max,
      guiSettings.penumbra.precision
    );
    this.gui.add(this.light, 'power', guiSettings.power.min, guiSettings.power.max, guiSettings.power.precision);
    this.gui.add(
      this.light.position,
      'x',
      guiSettings.range.x.min,
      guiSettings.range.x.max,
      guiSettings.range.precision
    );
    this.gui.add(
      this.light.position,
      'y',
      guiSettings.range.y.min,
      guiSettings.range.y.max,
      guiSettings.range.precision
    );
    this.gui.add(
      this.light.position,
      'z',
      guiSettings.range.z.min,
      guiSettings.range.z.max,
      guiSettings.range.precision
    );
  }

  onChange = () => {
    this.light.color.setHex(this.settings.color);
  };

  dispose() {
    this.gui.destroy();
  }
}
