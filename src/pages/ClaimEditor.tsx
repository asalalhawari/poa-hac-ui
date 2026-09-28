import { ArrowLeft, Save, ShieldCheck } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { hacApi } from '../api/hacApi';
import type { ClaimInput, ClaimProcedureInput } from '../api/hacTypes';
import { PageHeader } from '../components/UI';
import { useToast } from '../components/Feedback';

const toLocalInput = (iso?: string) => {
  if (!iso) return '';
  const d = new Date(iso), pad=(n:number)=>String(n).padStart(2,'0');
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};
const toIso = (v:string) => v ? new Date(v).toISOString() : undefined;

const emptyClaim = (): ClaimInput => ({
  claimId:'', patientId:'', patientAge:undefined, patientGender:undefined,
  providerId:'', providerFacilityCode:'', providerDisplayName:'',
  admissionDateTime:'', dischargeDateTime:undefined, encounterType:'INPATIENT',
  primaryDiagnosis:{code:'',description:'',isPrimaryAdmissionDiagnosis:true,isSuspectedHacCondition:false,firstObservedDateTime:undefined},
  diagnoses:[
    {code:'',description:'',isPrimaryAdmissionDiagnosis:true,isSuspectedHacCondition:false,firstObservedDateTime:undefined},
    {code:'',description:'',isPrimaryAdmissionDiagnosis:false,isSuspectedHacCondition:true,firstObservedDateTime:undefined},
  ],
  procedures:[], patientHistory:[], isPatientHistoryAvailable:false, reviewStatus:'NEW'
});

export default function ClaimEditor(){
  const {claimId}=useParams(); const editing=!!claimId; const nav=useNavigate(); const toast=useToast();
  const [form,setForm]=useState<ClaimInput>(emptyClaim()); const [loading,setLoading]=useState(editing); const [saving,setSaving]=useState(false); const [error,setError]=useState('');
  useEffect(()=>{ if(!claimId)return; hacApi.getClaim(claimId).then(setForm).catch(e=>setError(e.message)).finally(()=>setLoading(false)); },[claimId]);
  const admissionDx=form.primaryDiagnosis;
  const hacDx=useMemo(()=>form.diagnoses.find(d=>d.isSuspectedHacCondition) || form.diagnoses[1] || emptyClaim().diagnoses[1],[form]);
  const proc:ClaimProcedureInput=form.procedures[0] || {code:'',description:'',isPlannedOnAdmission:false};
  const patch=(p:Partial<ClaimInput>)=>setForm(f=>({...f,...p}));
  const patchAdmission=(p:any)=>setForm(f=>{const primary={...f.primaryDiagnosis,...p,isPrimaryAdmissionDiagnosis:true,isSuspectedHacCondition:false};return {...f,primaryDiagnosis:primary,diagnoses:[primary,...f.diagnoses.filter(d=>!d.isPrimaryAdmissionDiagnosis)]}});
  const patchHac=(p:any)=>setForm(f=>{const updated={...hacDx,...p,isPrimaryAdmissionDiagnosis:false,isSuspectedHacCondition:true};return {...f,diagnoses:[f.primaryDiagnosis,updated,...f.diagnoses.filter(d=>!d.isPrimaryAdmissionDiagnosis&&!d.isSuspectedHacCondition)]}});
  const patchProcedure=(p:any)=>setForm(f=>({...f,procedures:[{...proc,...p},...f.procedures.slice(1)]}));
  const submit=async(e:FormEvent)=>{e.preventDefault();setSaving(true);setError('');try{
    const payload={...form,primaryDiagnosis:{...form.primaryDiagnosis,firstObservedDateTime:form.primaryDiagnosis.firstObservedDateTime||form.admissionDateTime}};
    if(editing&&claimId){const r=await hacApi.updateClaim(claimId,payload);toast.show('success','Claim updated',`Saved and recalculated: ${r.investigationSummary.score} (${r.investigationSummary.level}).`);nav(`/claims/${claimId}`)}
    else {const r=await hacApi.createClaim(payload);const id=r.claims?.[0]?.claimId;toast.show('success','Claim saved',r.investigationSummary?`Calculated signal: ${r.investigationSummary.score} (${r.investigationSummary.level}).`:'Claim saved.');nav(id?`/claims/${id}`:'/claims')}
  }catch(err:any){setError(err.message);toast.show('error','Could not save claim',err.message)}finally{setSaving(false)}};
  if(loading)return <div className="card api-state">Loading claim…</div>;
  return <>
    <PageHeader title={editing?'Edit claim':'Add claim'} subtitle="Only entered or imported claim data is stored. No demo values are generated automatically." actions={<button className="btn outline" onClick={()=>nav('/claims')}><ArrowLeft size={16}/>Back</button>}/>
    <div className="info-banner"><ShieldCheck size={19}/><div><strong>Real-data mode</strong><span>Required business fields must come from the actual claim. Missing values are not silently invented.</span></div></div>
    {error&&<div className="card api-state api-error"><strong>Validation failed</strong><span>{error}</span></div>}
    <form className="claim-editor" onSubmit={submit}>
      <section className="card editor-section"><div className="editor-title"><span>1</span><div><h3>Claim & patient</h3><p>Identifiers must match the source claim/member data.</p></div></div><div className="editor-grid">
        <label><span>Claim ID *</span><input required disabled={editing} value={form.claimId||''} onChange={e=>patch({claimId:e.target.value})} placeholder="Source claim ID"/></label>
        <label><span>Patient / Member ID *</span><input required value={form.patientId} onChange={e=>patch({patientId:e.target.value})} placeholder="Member identifier"/></label>
        <label><span>Age</span><input type="number" min="0" max="130" value={form.patientAge??''} onChange={e=>patch({patientAge:e.target.value?Number(e.target.value):undefined})}/></label>
        <label><span>Gender</span><select value={form.patientGender||''} onChange={e=>patch({patientGender:(e.target.value||undefined) as any})}><option value="">Not provided</option><option value="F">Female</option><option value="M">Male</option><option value="OTHER">Other</option></select></label>
        <label><span>Encounter *</span><select value={form.encounterType||'INPATIENT'} onChange={e=>patch({encounterType:e.target.value as any})}><option value="INPATIENT">Inpatient</option><option value="OUTPATIENT">Outpatient</option></select></label>
        <label><span>Admission date/time *</span><input required type="datetime-local" value={toLocalInput(form.admissionDateTime)} onChange={e=>{const iso=toIso(e.target.value)||'';patch({admissionDateTime:iso});patchAdmission({firstObservedDateTime:iso})}}/></label>
        <label><span>Discharge date/time</span><input type="datetime-local" value={toLocalInput(form.dischargeDateTime)} onChange={e=>patch({dischargeDateTime:toIso(e.target.value)})}/></label>
      </div></section>

      <section className="card editor-section"><div className="editor-title"><span>2</span><div><h3>Provider</h3><p>Stable IDs are required; free-text name alone is not enough.</p></div></div><div className="editor-grid">
        <label><span>Provider ID *</span><input required value={form.providerId} onChange={e=>patch({providerId:e.target.value})}/></label>
        <label><span>Facility code *</span><input required value={form.providerFacilityCode} onChange={e=>patch({providerFacilityCode:e.target.value})}/></label>
        <label className="span-2"><span>Provider name *</span><input required value={form.providerDisplayName} onChange={e=>patch({providerDisplayName:e.target.value})}/></label>
      </div></section>

      <section className="card editor-section"><div className="editor-title"><span>3</span><div><h3>Admission diagnosis</h3><p>The condition that explains why the patient entered the encounter.</p></div></div><div className="editor-grid">
        <label><span>Diagnosis code *</span><input required value={admissionDx.code} onChange={e=>patchAdmission({code:e.target.value})}/></label>
        <label className="span-2"><span>Description *</span><input required value={admissionDx.description} onChange={e=>patchAdmission({description:e.target.value})}/></label>
      </div></section>

      <section className="card editor-section emphasis"><div className="editor-title"><span>4</span><div><h3>Suspected hospital-acquired condition</h3><p>This is the diagnosis the HAC engine evaluates.</p></div></div><div className="editor-grid">
        <label><span>Diagnosis code *</span><input required value={hacDx.code} onChange={e=>patchHac({code:e.target.value})}/></label>
        <label className="span-2"><span>Description *</span><input required value={hacDx.description} onChange={e=>patchHac({description:e.target.value})}/></label>
        <label><span>First observed date/time</span><input type="datetime-local" value={toLocalInput(hacDx.firstObservedDateTime)} onChange={e=>patchHac({firstObservedDateTime:toIso(e.target.value)})}/><small>If missing, POA timing will be reported as unavailable.</small></label>
      </div></section>

      <section className="card editor-section"><div className="editor-title"><span>5</span><div><h3>Related procedure / intervention</h3><p>Optional. Add only if this claim actually contains a relevant procedure or intervention.</p></div></div><div className="editor-grid">
        <label><span>Procedure code</span><input value={proc.code||''} onChange={e=>patchProcedure({code:e.target.value})}/></label>
        <label className="span-2"><span>Description</span><input value={proc.description||''} onChange={e=>patchProcedure({description:e.target.value})}/></label>
        <label><span>Performed date/time</span><input type="datetime-local" value={toLocalInput(proc.performedDateTime)} onChange={e=>patchProcedure({performedDateTime:toIso(e.target.value)})}/></label>
        <label className="toggle-field"><input type="checkbox" checked={!!proc.isPlannedOnAdmission} onChange={e=>patchProcedure({isPlannedOnAdmission:e.target.checked})}/><span><strong>Planned on admission</strong><small>Was the procedure already part of the admission plan?</small></span></label>
        <label className="toggle-field"><input type="checkbox" checked={!!proc.isReturnToTheatre} onChange={e=>patchProcedure({isReturnToTheatre:e.target.checked})}/><span><strong>Return to theatre</strong></span></label>
        <label className="toggle-field"><input type="checkbox" checked={!!proc.isRescueIntervention} onChange={e=>patchProcedure({isRescueIntervention:e.target.checked})}/><span><strong>High-acuity rescue</strong></span></label>
        <label className="toggle-field"><input type="checkbox" checked={!!proc.isImagingOrDiagnostic} onChange={e=>patchProcedure({isImagingOrDiagnostic:e.target.checked})}/><span><strong>Imaging / diagnostic only</strong></span></label>
        <label className="toggle-field"><input type="checkbox" checked={!!proc.requiresPreApproval} onChange={e=>patchProcedure({requiresPreApproval:e.target.checked})}/><span><strong>Pre-approval normally required</strong></span></label>
        <label className="toggle-field"><input type="checkbox" checked={!!proc.preApprovalObtained} onChange={e=>patchProcedure({preApprovalObtained:e.target.checked})}/><span><strong>Pre-approval obtained</strong></span></label>
        <label className="toggle-field"><input type="checkbox" checked={!!proc.isRescueDrug} onChange={e=>patchProcedure({isRescueDrug:e.target.checked})}/><span><strong>Rescue drug</strong></span></label>
        <label className="toggle-field"><input type="checkbox" checked={!!proc.specialtyShift} onChange={e=>patchProcedure({specialtyShift:e.target.checked})}/><span><strong>Specialty shift</strong></span></label>
        <label className="toggle-field"><input type="checkbox" checked={!!proc.hasAbnormalResult} onChange={e=>patchProcedure({hasAbnormalResult:e.target.checked})}/><span><strong>Abnormal result</strong></span></label>
      </div></section>

      <section className="card editor-section"><div className="editor-title"><span>6</span><div><h3>History availability</h3><p>Tell the engine whether longitudinal patient history is actually available.</p></div></div><label className="toggle-field"><input type="checkbox" checked={form.isPatientHistoryAvailable} onChange={e=>patch({isPatientHistoryAvailable:e.target.checked})}/><span><strong>Patient history available</strong><small>If off, provider-linkage output will be marked unavailable rather than assumed clean.</small></span></label></section>
      <div className="editor-submit"><button type="button" className="btn outline" onClick={()=>nav('/claims')}>Cancel</button><button type="submit" className="btn primary" disabled={saving}><Save size={16}/>{saving?'Saving & calculating…':editing?'Save changes':'Save claim & calculate'}</button></div>
    </form>
  </>;
}
