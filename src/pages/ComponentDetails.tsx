import { ArrowLeft, Info } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { hacApi } from '../api/hacApi';
import type { HacInvestigation } from '../api/hacTypes';

export default function ComponentDetails(){
  const {claimId='',component=''}=useParams(); const nav=useNavigate(); const [data,setData]=useState<HacInvestigation|null>(null); const [error,setError]=useState('');
  useEffect(()=>{hacApi.getInvestigation(claimId).then(setData).catch(e=>setError(e.message))},[claimId]);
  if(error)return <div className="card api-state api-error">{error}</div>; if(!data)return <div className="card api-state">Loading component evidence…</div>;
  const key=`component${component.toUpperCase()}` as keyof typeof data.technicalBreakdown; const detail:any=data.technicalBreakdown[key]; const row=data.technicalBreakdown.rows.find(r=>r.component===component.toUpperCase());
  return <div><button className="btn outline" onClick={()=>nav(`/claims/${claimId}/scoring`)}><ArrowLeft size={15}/> Scoring</button><div className="page-header"><div><h1>{row?.label||`Component ${component}`}</h1><p>{row?.bandAndDescription}</p></div><div className="score-summary"><strong>{row?.scoreDisplay}</strong></div></div><div className="card" style={{padding:24}}><h3>Backend evidence</h3><p>{detail?.reasoning||'No explanation returned.'}</p><div className="v3-tech-note"><Info size={17}/><p>This page is populated from the live investigation API. Raw technical fields are shown below for implementation validation.</p></div><pre className="api-json">{JSON.stringify(detail,null,2)}</pre></div></div>
}
