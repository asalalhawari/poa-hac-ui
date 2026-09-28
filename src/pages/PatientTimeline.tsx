import { Activity, Stethoscope, Syringe, TriangleAlert } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { hacApi } from '../api/hacApi';
import type { HacInvestigation } from '../api/hacTypes';
import { PageHeader } from '../components/UI';

const iconFor=(type:string)=> type==='procedure'?Syringe:type==='diagnosis'?TriangleAlert:type==='admission'?Stethoscope:Activity;
export default function PatientTimeline(){
  const {claimId=''}=useParams(); const [data,setData]=useState<HacInvestigation|null>(null); const [error,setError]=useState('');
  useEffect(()=>{hacApi.getInvestigation(claimId).then(setData).catch(e=>setError(e.message))},[claimId]);
  if(error)return <div className="card api-state api-error">{error}</div>;
  if(!data)return <div className="card api-state">Loading patient timeline…</div>;
  return <><PageHeader title="Patient Timeline" subtitle={`${data.claimId} · Chronological evidence from backend`}/><div className="timeline-layout"><div className="card timeline-card">{data.timeline.map((ev)=>{const Icon=iconFor(ev.eventType);return <div className="timeline-item" key={ev.id}><div className="timeline-date"><strong>{new Date(ev.dateTime).toLocaleDateString()}</strong><span>{new Date(ev.dateTime).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}</span></div><div className={`timeline-icon ${ev.status==='critical'?'red':ev.status==='warning'?'amber':ev.status==='positive'?'green':'blue'}`}><Icon size={17}/></div><div><h4>{ev.title}</h4><p>{ev.subtitle}</p>{ev.code&&<small>{ev.code}</small>}</div></div>})}</div><div className="card insight-card"><h3>Backend Findings</h3><ul>{data.findingsCards.map(f=><li key={f.key}>{f.title}: {f.headline} ({f.points}/{f.maxPoints})</li>)}</ul></div></div></>
}
