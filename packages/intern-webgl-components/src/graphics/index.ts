import { getGPUTier, TierResult } from 'detect-gpu';
import qualitySettings from './quality-settings';
import { getQueryFromParams } from '../utils/query-params';

export enum Quality {
  Normal = 'Normal',
  Medium = 'Medium',
  High = 'High'
}

export const QUALITY_MODES = [Quality.Normal, Quality.Medium, Quality.High];

/**
 * Graphics manager
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

    if (typeof qualityMode === 'string' && QUALITY_MODES.includes(qualityMode)) {
      this.quality = qualityMode;
    } else {
      this.quality = this.tiers[this.gpuTier.tier];
    }
  }

  equals(quality: Quality) {
    return quality === this.quality;
  }

  getQualitySettings() {
    return qualitySettings.get(this.quality);
  }
}

const graphics: Graphics = new Graphics();

export default graphics;
