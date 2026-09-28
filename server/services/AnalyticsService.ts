import { ReviewWorkflowService } from './ReviewWorkflowService.js';
import { HacScoringService } from './HacScoringService.js';

export class AnalyticsService {
  static getSummary() {
    const claims = ReviewWorkflowService.getAllClaims();
    const scored = claims.map(claim => ({ claim, inv: HacScoringService.calculateInvestigation(claim, ReviewWorkflowService.getNotes(claim.claimId).length, ReviewWorkflowService.getLastDecision(claim.claimId)?.outcome) }));
    const total = scored.length;
    const high = scored.filter(x=>x.inv.signalResult.level==='HIGH').length;
    const review = scored.filter(x=>x.inv.signalResult.level==='REVIEW').length;
    const monitor = scored.filter(x=>x.inv.signalResult.level==='MONITOR').length;
    const none = scored.filter(x=>x.inv.signalResult.level==='NONE').length;
    const avg = total ? Math.round(scored.reduce((a,x)=>a+x.inv.signalResult.score,0)/total) : 0;
    const confirmed = scored.filter(x=>x.claim.reviewStatus==='CONFIRMED').length;
    const providerMap = new Map<string,{provider:string;cases:number;high:number;avg:number;sum:number}>();
    const diagnosisMap = new Map<string,{code:string;cases:number;sum:number;max:number}>();
    for (const {claim,inv} of scored) {
      const p=providerMap.get(claim.providerId)||{provider:claim.providerDisplayName,cases:0,high:0,avg:0,sum:0}; p.cases++; p.sum+=inv.signalResult.score; if(inv.signalResult.level==='HIGH')p.high++; providerMap.set(claim.providerId,p);
      const d=claim.diagnoses.find(x=>x.isSuspectedHacCondition)||claim.primaryDiagnosis; const m=diagnosisMap.get(d.code)||{code:d.code,cases:0,sum:0,max:0}; m.cases++;m.sum+=inv.signalResult.score;m.max=Math.max(m.max,inv.signalResult.score);diagnosisMap.set(d.code,m);
    }
    const providers=[...providerMap.entries()].map(([id,p])=>({providerId:id,provider:p.provider,cases:p.cases,high:p.high,averageScore:p.cases?Math.round(p.sum/p.cases):0})).sort((a,b)=>b.averageScore-a.averageScore);
    const topDiagnoses=[...diagnosisMap.values()].map(d=>({code:d.code,cases:d.cases,averageScore:Math.round(d.sum/d.cases),maxScore:d.max})).sort((a,b)=>b.averageScore-a.averageScore).slice(0,8);
    const componentTotals = { coding:0,timing:0,relatedness:0,intervention:0,history:0 };
    scored.forEach(x=>{componentTotals.coding+=x.inv.technicalBreakdown.componentA.points;componentTotals.timing+=x.inv.technicalBreakdown.componentB.points;componentTotals.relatedness+=x.inv.technicalBreakdown.componentC.points;componentTotals.intervention+=x.inv.technicalBreakdown.componentD.points;componentTotals.history+=x.inv.technicalBreakdown.componentE.points;});
    return { generatedAt:new Date().toISOString(), summary:{totalCases:total,averageScore:avg,highPriority:high,confirmed,signalDistribution:{HIGH:high,REVIEW:review,MONITOR:monitor,NONE:none}}, componentTotals, providers, topDiagnoses };
  }
}
