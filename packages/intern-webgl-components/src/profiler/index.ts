import { getGPUTier, TierResult } from 'detect-gpu';

export const GRAPHICS_HIGH = 'high';
export const GRAPHICS_NORMAL = 'normal';
export const GRAPHICS_MODES = [GRAPHICS_HIGH, GRAPHICS_NORMAL];

/**
 * Profile the device GPU
 *
 * @class Profiler
 */
class Profiler {
  graphics: string = GRAPHICS_NORMAL;
  gpuTier: TierResult = { type: 'BENCHMARK', tier: 0 };

  async run() {
    this.gpuTier = await getGPUTier();
    this.graphics = this.getGraphics();
  }

  equals(value: string) {
    return value === this.graphics;
  }

  getGraphics() {
    switch (this.gpuTier.tier) {
      case 3:
      case 2:
        return GRAPHICS_HIGH;
      default:
        return GRAPHICS_NORMAL;
    }
  }
}

const profiler: Profiler = new Profiler();

export default profiler;
