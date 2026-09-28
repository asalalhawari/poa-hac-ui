/** Component E — provider linkage */
import { ClaimEntity, ComponentEScore, HacConfigDTO } from '../contracts/hac.types.js';

export class ProviderHistoryService {
  public static evaluate(claim: ClaimEntity, config: HacConfigDTO): ComponentEScore {
    const lookbackDays = config.thresholds.historyLookbackDays;
    const maxPoints = config.componentWeights.maxE;
    if (!claim.isPatientHistoryAvailable) {
      return { component:'E', title:'Provider linkage', outcome:'UNAVAILABLE', outcomeLabel:'Member history unavailable', lookbackDaysSearched:lookbackDays, historyAvailable:false, points:0, maxPoints, reasoning:'Member longitudinal history was unavailable. Absence of a prior procedure must not be interpreted as a clean history.' };
    }
    const procedures = (claim.patientHistory || []).filter(h => h.procedureCode && h.isRelatedToCurrentCondition && h.daysPriorToAdmission >= 0 && h.daysPriorToAdmission <= lookbackDays);
    const sameProviderRecent = procedures.find(h => h.providerId === claim.providerId && h.daysPriorToAdmission <= 30);
    if (sameProviderRecent) return { component:'E', title:'Provider linkage', outcome:'SAME_PROVIDER_30D', outcomeLabel:'Procedure at this provider within 30 days', lookbackDaysSearched:lookbackDays, historyAvailable:true, linkedPriorClaimId:sameProviderRecent.claimId, linkedPriorProcedure:`${sameProviderRecent.procedureDescription || sameProviderRecent.procedureCode} (${sameProviderRecent.daysPriorToAdmission}d prior)`, linkedPriorDays:sameProviderRecent.daysPriorToAdmission, points:Math.min(15,maxPoints), maxPoints, reasoning:`A related procedure was found at the same provider ${sameProviderRecent.daysPriorToAdmission} days before the current claim.` };
    const sameProviderOlder = procedures.find(h => h.providerId === claim.providerId && h.daysPriorToAdmission > 30 && h.daysPriorToAdmission <= lookbackDays);
    if (sameProviderOlder) return { component:'E', title:'Provider linkage', outcome:'SAME_PROVIDER_31_90D', outcomeLabel:'Procedure at this provider 31–90 days earlier', lookbackDaysSearched:lookbackDays, historyAvailable:true, linkedPriorClaimId:sameProviderOlder.claimId, linkedPriorProcedure:`${sameProviderOlder.procedureDescription || sameProviderOlder.procedureCode} (${sameProviderOlder.daysPriorToAdmission}d prior)`, linkedPriorDays:sameProviderOlder.daysPriorToAdmission, points:Math.min(9,maxPoints), maxPoints, reasoning:`A related procedure was found at the same provider ${sameProviderOlder.daysPriorToAdmission} days before the current claim.` };
    const differentProvider = procedures.find(h => h.providerId !== claim.providerId);
    if (differentProvider) return { component:'E', title:'Provider linkage', outcome:'DIFFERENT_PROVIDER', outcomeLabel:'Prior related procedure at a different provider', lookbackDaysSearched:lookbackDays, historyAvailable:true, linkedPriorClaimId:differentProvider.claimId, linkedPriorProcedure:`${differentProvider.procedureDescription || differentProvider.procedureCode} (${differentProvider.daysPriorToAdmission}d prior)`, linkedPriorDays:differentProvider.daysPriorToAdmission, points:Math.min(3,maxPoints), maxPoints, reasoning:`A related prior procedure was found at a different provider. This should route the case rather than attribute the event to the current provider.` };
    return { component:'E', title:'Provider linkage', outcome:'NOTHING_FOUND', outcomeLabel:'No prior related procedure found', lookbackDaysSearched:lookbackDays, historyAvailable:true, points:0, maxPoints, reasoning:`No related prior procedure was found in the available ${lookbackDays}-day history.` };
  }
}
