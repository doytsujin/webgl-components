import { Vector2, MathUtils } from 'three';
import { Quality } from './graphics';

export type GraphicsConfig = {
  antialias: boolean;
  pixelRatio: number;
  maxFrameBufferSize: Vector2;
};

class GraphicsConfigGroup {
  high: GraphicsConfig = {
    antialias: true,
    pixelRatio: MathUtils.clamp(window.devicePixelRatio, 1, 2),
    maxFrameBufferSize: new Vector2(1920, 1080)
  };
  medium: GraphicsConfig = {
    antialias: true,
    pixelRatio: MathUtils.clamp(window.devicePixelRatio, 1, 2),
    maxFrameBufferSize: new Vector2(1920, 1080)
  };
  normal: GraphicsConfig = {
    antialias: true,
    pixelRatio: 1,
    maxFrameBufferSize: new Vector2(1280, 720)
  };

  get(mode: Quality) {
    switch (mode) {
      case Quality.High:
        return config.high;
      case Quality.Medium:
        return config.medium;
      default:
        return config.normal;
    }
  }
}

const config: GraphicsConfigGroup = new GraphicsConfigGroup();

export default config;
