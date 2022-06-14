import { Vector2, MathUtils } from 'three';
import { Quality } from '.';

export type GraphicsSettings = {
  antialias: boolean;
  pixelRatio: number;
  resolution: Vector2;
};

class QualitySettings {
  high: GraphicsSettings = {
    antialias: true,
    pixelRatio: MathUtils.clamp(window.devicePixelRatio, 1, 2),
    resolution: new Vector2(1920, 1080)
  };
  medium: GraphicsSettings = {
    antialias: true,
    pixelRatio: MathUtils.clamp(window.devicePixelRatio, 1, 2),
    resolution: new Vector2(1920, 1080)
  };
  normal: GraphicsSettings = {
    antialias: true,
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

const qualitySettings: QualitySettings = new QualitySettings();

export default qualitySettings;
