import { useEffect, useState } from 'react';
import { hacApi } from '../api/hacApi';
import { PageHeader } from '../components/UI';
import { useToast } from '../components/Feedback';

export default function Settings(){
  const toast=useToast();
  const [config,setConfig]=useState<any>(null); const [error,setError]=useState(''); const [saving,setSaving]=useState(false);
  const load=()=>hacApi.getConfig().then(setConfig).catch(e=>setError(e.message)); useEffect(()=>{load()},[]);
  if(error)return <div className="card api-state api-error">{error}</div>; if(!config)return <div className="card api-state">Loading HAC configuration…</div>;
  const update=(group:string,key:string,value:number)=>setConfig((c:any)=>({...c,[group]:{...c[group],[key]:value}}));
  const save=async()=>{setSaving(true);try{const r=await hacApi.updateConfig(config);setConfig(r.config);toast.show('success','Configuration saved','The backend is now using the updated HAC thresholds.')}catch(e:any){toast.show('error','Configuration update failed',e.message)}finally{setSaving(false)}};
  return <><PageHeader title="HAC Configuration" subtitle="Persistent backend thresholds used by the scoring service." actions={<button className="btn primary" onClick={save} disabled={saving}>{saving?'Saving…':'Save configuration'}</button>}/><div className="card" style={{padding:24}}><h3>Signal level cutoffs</h3><div className="settings-grid">{Object.entries(config.signalLevelCutoffs||{}).map(([k,v])=><label key={k}><span>{k}</span><input type="number" value={Number(v)} onChange={e=>update('signalLevelCutoffs',k,Number(e.target.value))}/></label>)}</div><h3>Timing & history thresholds</h3><div className="settings-grid">{Object.entries(config.thresholds||{}).map(([k,v])=><label key={k}><span>{k}</span><input type="number" value={Number(v)} onChange={e=>update('thresholds',k,Number(e.target.value))}/></label>)}</div><div className="v3-tech-note"><p>Component weights and suppressor settings remain visible in the API response. Changes are persisted by the backend and used by subsequent HAC calculations.</p></div></div></>
}
