import { getGPUTier, TierResult } from 'detect-gpu';
import { getQueryFromParams } from '../../utils/query-params';

export enum Quality {
  Normal = 0,
  Medium = 1,
  High = 2
}

export const QUALITY_MODES = [Quality.Normal, Quality.Medium, Quality.High];

/**
 * Profile the device GPU
 *
 * @class Graphics
 */
class Graphics {
  quality: Quality = Quality.Normal;
  gpuTier: TierResult = { type: 'BENCHMARK', tier: 0 };
  tiers: Array<Quality> = [Quality.Normal, Quality.Medium, Quality.High];

  async profile() {
    this.gpuTier = await getGPUTier();

    // If the graphics query parameter is set, use it over the current gpu tier
    const qualityMode = getQueryFromParams('quality', window.parent);
    console.log('qualityMode', qualityMode);

    if (typeof qualityMode === 'string' && QUALITY_MODES.includes(qualityMode)) {
      this.quality = qualityMode;
    } else {
      this.quality = this.getGraphics();
    }
  }

  equals(quality: Quality) {
    return quality === this.quality;
  }

  setTier(tiers: Array<Quality>) {
    this.tiers = tiers;
  }

  getGraphics() {
    return this.tiers[this.gpuTier.tier];
  }
}

const graphics: Graphics = new Graphics();

export default graphics;
