/** Component B — timing / inferred POA */
import { ComponentBScore, DiagnosisEntry, HacConfigDTO } from '../contracts/hac.types.js';

export class TimingPoaService {
  public static evaluate(
    admissionDateTime: string,
    targetDiagnosis: DiagnosisEntry | undefined,
    config: HacConfigDTO,
    encounterType: 'INPATIENT' | 'OUTPATIENT' = 'INPATIENT'
  ): ComponentBScore {
    const maxPoints = config.componentWeights.maxB;
    const midStayThreshold = config.thresholds.midStayThresholdHours;
    const earlyWindow = config.thresholds.earlyWindowHours;
    const base = {
      component: 'B' as const,
      title: 'New mid-stay indication (Timing / Inferred POA)',
      admissionDateTime: admissionDateTime || 'NOT_PROVIDED',
      thresholdHours: midStayThreshold,
      earlyWindowHours: earlyWindow,
      maxPoints,
    };

    if (!admissionDateTime || isNaN(new Date(admissionDateTime).getTime())) {
      return { ...base, band: 'B_UNKNOWN', bandLabel: 'Unable to determine timing', firstObservedDateTime: null, elapsedHoursFromAdmission: null, points: 0, timingInferred: false, reasoning: 'Admission timestamp is missing or invalid; timing cannot be calculated.' };
    }
    if (encounterType === 'OUTPATIENT') {
      return { ...base, band: 'B4', bandLabel: 'Outpatient encounter', firstObservedDateTime: targetDiagnosis?.firstObservedDateTime || null, elapsedHoursFromAdmission: null, points: 0, timingInferred: true, reasoning: 'Outpatient encounter: there is no inpatient stay against which mid-stay onset can be inferred.' };
    }
    if (!targetDiagnosis?.firstObservedDateTime || isNaN(new Date(targetDiagnosis.firstObservedDateTime).getTime())) {
      return { ...base, band: 'B_UNKNOWN', bandLabel: 'Unable to determine first appearance', firstObservedDateTime: null, elapsedHoursFromAdmission: null, points: 0, timingInferred: false, reasoning: 'The first observed diagnosis timestamp is missing or invalid.' };
    }

    const admissionMs = new Date(admissionDateTime).getTime();
    const observedMs = new Date(targetDiagnosis.firstObservedDateTime).getTime();
    const elapsed = Math.max(0, Math.round(((observedMs - admissionMs) / 3600000) * 10) / 10);

    if (observedMs <= admissionMs) {
      return { ...base, band: 'B4', bandLabel: 'Present on admission line', firstObservedDateTime: targetDiagnosis.firstObservedDateTime, elapsedHoursFromAdmission: 0, points: 0, timingInferred: true, reasoning: 'The diagnosis was already present on the admission line; no mid-stay timing signal is assigned.' };
    }
    if (elapsed >= midStayThreshold) {
      return { ...base, band: 'B1', bandLabel: 'First appears 48 hours or more after admission', firstObservedDateTime: targetDiagnosis.firstObservedDateTime, elapsedHoursFromAdmission: elapsed, points: 20, timingInferred: true, reasoning: `The diagnosis first appeared ${elapsed} hours after admission, meeting the >=${midStayThreshold} hour threshold.` };
    }
    if (elapsed >= earlyWindow) {
      return { ...base, band: 'B2', bandLabel: 'First appears between 24 and 48 hours', firstObservedDateTime: targetDiagnosis.firstObservedDateTime, elapsedHoursFromAdmission: elapsed, points: 12, timingInferred: true, reasoning: `The diagnosis first appeared ${elapsed} hours after admission, within the ${earlyWindow}-${midStayThreshold} hour window.` };
    }
    return { ...base, band: 'B3', bandLabel: 'Appears after admission line, within 24 hours', firstObservedDateTime: targetDiagnosis.firstObservedDateTime, elapsedHoursFromAdmission: elapsed, points: 6, timingInferred: true, reasoning: `The diagnosis appeared after the admission line but within ${earlyWindow} hours. This is a weak timing signal, not equivalent to confirmed POA.` };
  }
}
