import { getGPUTier, TierResult } from 'detect-gpu';
import qualitySettings from './quality-settings';

export class Quality {
  static Normal = 'Normal';
  static Medium = 'Medium';
  static High = 'High';
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

  async profile(qualityMode: Quality | void) {
    this.gpuTier = await getGPUTier();

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
