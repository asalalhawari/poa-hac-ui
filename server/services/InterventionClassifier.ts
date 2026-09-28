/** Component D — intervention ladder + modifiers, capped at 25 */
import { ClaimEntity, ComponentDCategory, ComponentDScore, HacConfigDTO, ProcedureEntry } from '../contracts/hac.types.js';

export class InterventionClassifier {
  public static evaluate(claim: ClaimEntity, config: HacConfigDTO): ComponentDScore {
    const cap = Math.min(config.thresholds.interventionScoreCap, config.componentWeights.maxD);
    const procedures = claim.procedures || [];
    let category: ComponentDCategory = 'NO_INTERVENTION';
    let label = 'No classified intervention triggered';
    let basePoints = 0;
    let trigger: ProcedureEntry | undefined;

    trigger = procedures.find(p => p.isReturnToTheatre || /reoperation|re-exploration|return to theatre|revision|debridement|incision and drainage/i.test(p.description));
    if (trigger) { category='RETURN_TO_THEATRE'; label='Return to theatre'; basePoints=25; }
    else {
      trigger = procedures.find(p => p.isRescueIntervention || /transfusion|dialysis|ventilat|vasopressor|intubat|resuscitat|intensive care|\bicu\b/i.test(p.description));
      if (trigger) { category='HIGH_ACUITY_RESCUE'; label='High-acuity rescue intervention'; basePoints=20; }
      else {
        trigger = procedures.find(p => !p.isPlannedOnAdmission && !p.isImagingOrDiagnostic && !/imaging|ct |mri|x-ray|ultrasound|diagnostic|endoscop/i.test(p.description));
        if (trigger) { category='UNPLANNED_OPERATION'; label='Unplanned operation'; basePoints=14; }
        else {
          trigger = procedures.find(p => p.isImagingOrDiagnostic || /imaging|ct |mri|x-ray|ultrasound|diagnostic|endoscop/i.test(p.description));
          if (trigger) { category='IMAGING_OR_DIAGNOSTIC_ONLY'; label='Imaging or diagnostics only'; basePoints=8; }
        }
      }
    }

    const modifiers: ComponentDScore['modifiers'] = [];
    if (procedures.some(p => p.requiresPreApproval && p.preApprovalObtained === false)) modifiers.push({ type:'NO_PREAPPROVAL', points:3, reason:'A mid-stay service that ordinarily requires pre-approval was delivered without approval.' });
    if (procedures.some(p => p.isRescueDrug)) modifiers.push({ type:'RESCUE_DRUG', points:3, reason:'A rescue/reversal drug was documented after admission.' });
    if (procedures.some(p => p.specialtyShift)) modifiers.push({ type:'SPECIALTY_SHIFT', points:2, reason:'The case shifted to a higher-acuity or different specialty.' });
    if (procedures.some(p => p.hasAbnormalResult)) modifiers.push({ type:'ABNORMAL_RESULT', points:2, reason:'An investigation linked to the event returned an abnormal result.' });

    const modifierPoints = modifiers.reduce((s,m)=>s+m.points,0);
    const rawModifierPoints = basePoints + modifierPoints;
    const points = Math.min(rawModifierPoints, cap);
    return {
      component:'D', title:'Unplanned intervention triggered', category, categoryLabel:label,
      triggerProcedureCode:trigger?.code, triggerProcedureDescription:trigger?.description,
      rawModifierPoints, basePoints, modifiers, points, maxPoints:config.componentWeights.maxD,
      isCeilingApplied: rawModifierPoints > points,
      reasoning: basePoints === 0 ? 'No classified intervention was identified. Modifiers do not fire independently of an intervention band.' : `${label} contributed ${basePoints} base points${modifierPoints ? ` plus ${modifierPoints} modifier points` : ''}; Component D is capped at ${cap}.`
    };
  }
}
