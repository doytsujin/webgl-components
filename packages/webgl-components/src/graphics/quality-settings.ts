import { Vector2, MathUtils } from 'three';

export type GraphicsSettings = {
  pixelRatio: number;
  resolution: Vector2;
  [key: string]: unknown;
};

export class Quality {
  static Normal = 'Normal';
  static Medium = 'Medium';
  static High = 'High';
}

export default class QualitySettings {
  high: GraphicsSettings = {
    pixelRatio: MathUtils.clamp(window.devicePixelRatio, 1, 2),
    resolution: new Vector2(1920, 1080)
  };
  medium: GraphicsSettings = {
    pixelRatio: MathUtils.clamp(window.devicePixelRatio, 1, 2),
    resolution: new Vector2(1920, 1080)
  };
  normal: GraphicsSettings = {
    pixelRatio: 1,
    resolution: new Vector2(1280, 720)
  };

  get(mode: Quality) {
    switch (mode) {
      case Quality.High:
        return this.high;
      case Quality.Medium:
        return this.medium;
      default:
        return this.normal;
    }
  }
}
