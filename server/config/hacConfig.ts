import { HacConfigDTO } from '../contracts/hac.types.js';
import { PersistentJsonStore } from '../services/PersistentJsonStore.js';

const DEFAULT_CONFIG: HacConfigDTO = {
  thresholds: {
    midStayThresholdHours: 48,
    earlyWindowHours: 24,
    historyLookbackDays: 90,
    interventionScoreCap: 25,
  },
  signalLevelCutoffs: { high: 75, review: 50, monitor: 25 },
  componentWeights: { maxA: 20, maxB: 20, maxC: 20, maxD: 25, maxE: 15 },
  suppressors: {
    enableRecognizedProgressionCap: true,
    recognizedProgressionCap: 30,
    enableDifferentProviderCap: true,
    differentProviderCap: 15,
    enablePalliativeCareExclusion: false,
    enablePlannedStagedExclusion: false,
  },
  audit: {
    modelVersion: 'rules-engine-no-ai-model',
    rulesVersion: 'hac-spec-a-e-v1',
    dataVersion: 'persistent-runtime-store-v1',
  },
};

class HacConfigurationManager {
  public getConfig(): Readonly<HacConfigDTO> {
    return PersistentJsonStore.read<HacConfigDTO>('config.json', DEFAULT_CONFIG);
  }

  public updateConfig(partialConfig: Partial<HacConfigDTO>): HacConfigDTO {
    const current = this.getConfig() as HacConfigDTO;
    const next: HacConfigDTO = {
      ...current,
      thresholds: { ...current.thresholds, ...(partialConfig.thresholds || {}) },
      signalLevelCutoffs: { ...current.signalLevelCutoffs, ...(partialConfig.signalLevelCutoffs || {}) },
      componentWeights: { ...current.componentWeights, ...(partialConfig.componentWeights || {}) },
      suppressors: { ...current.suppressors, ...(partialConfig.suppressors || {}) },
      audit: { ...current.audit, ...(partialConfig.audit || {}) },
    };
    if (next.thresholds.midStayThresholdHours <= 0 || next.thresholds.earlyWindowHours < 0 || next.thresholds.historyLookbackDays < 0) throw new Error('Threshold values must be non-negative and midStayThresholdHours must be positive.');
    if (!(next.signalLevelCutoffs.high > next.signalLevelCutoffs.review && next.signalLevelCutoffs.review > next.signalLevelCutoffs.monitor)) throw new Error('Signal cutoffs must satisfy High > Review > Monitor.');
    PersistentJsonStore.write('config.json', next);
    return JSON.parse(JSON.stringify(next));
  }
}

export const HacConfigService = new HacConfigurationManager();
