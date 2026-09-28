import { ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { hacApi } from '../api/hacApi';
import type { HacInvestigation } from '../api/hacTypes';
import { PageHeader, RiskBadge } from '../components/UI';

export default function ScoringDetails(){
  const nav=useNavigate(); const {claimId=''}=useParams(); const [data,setData]=useState<HacInvestigation|null>(null); const [error,setError]=useState('');
  useEffect(()=>{hacApi.getInvestigation(claimId).then(setData).catch(e=>setError(e.message))},[claimId]);
  if(error)return <div className="card api-state api-error">{error}</div>; if(!data)return <div className="card api-state">Loading scoring details…</div>;
  return <><PageHeader title="HAC Signal Scoring Details" subtitle="Backend-calculated technical breakdown" actions={<div className="score-summary"><div><span>Total Score</span><strong>{data.signalResult.score}</strong><small>out of 100</small></div><RiskBadge risk={data.signalResult.level}/></div>}/><div className="component-list">{data.technicalBreakdown.rows.map(row=><button className="component-card" key={row.component} onClick={()=>nav(`/claims/${claimId}/scoring/${row.component}`)}><span className="component-icon">{row.component}</span><span className="component-copy"><strong>{row.label}</strong><small>{row.bandAndDescription}</small></span><span className="component-score">{row.scoreDisplay}</span><ChevronRight size={18}/></button>)}</div></>
}
