import { getGPUTier, TierResult } from 'detect-gpu';
import { MathUtils } from 'three';
import QualitySettings, { Quality } from './quality-settings';

export const QUALITY_MODES = [Quality.Normal, Quality.Medium, Quality.High];

/**
 * Graphics manager
 *
 * @class Graphics
 */
class GraphicsProfiler {
  quality: Quality = Quality.Normal;
  gpuTier: TierResult = { type: 'BENCHMARK', tier: 0 };
  tiers: Array<Quality> = [Quality.Normal, Quality.Medium, Quality.High];
  qualitySettings: QualitySettings = new QualitySettings();

  async run(qualityMode: Quality | void, detectGpuOptions = {}) {
    this.gpuTier = await getGPUTier(detectGpuOptions);

    if (typeof qualityMode === 'string' && QUALITY_MODES.includes(qualityMode)) {
      this.quality = qualityMode;
    } else {
      this.quality = this.tiers[MathUtils.clamp(this.gpuTier.tier - 1, 0, 2)];
    }
  }

  equals(quality: Quality) {
    return quality === this.quality;
  }

  setQualitySettings(qualitySettings: QualitySettings) {
    this.qualitySettings = qualitySettings;
  }

  getQualitySettings() {
    return this.qualitySettings.get(this.quality);
  }
}

const graphicsProfiler: GraphicsProfiler = new GraphicsProfiler();

export default graphicsProfiler;
