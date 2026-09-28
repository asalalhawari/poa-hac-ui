import { Activity, AlertTriangle, ArrowRight, BarChart3, CheckCircle2, Plus, ShieldCheck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { hacApi } from '../api/hacApi';
import type { AnalyticsResponse, ReviewQueueResponse } from '../api/hacTypes';
import { PageHeader, RiskBadge, StatCard, StatusBadge } from '../components/UI';

export default function Dashboard(){
  const nav=useNavigate();
  const [queue,setQueue]=useState<ReviewQueueResponse|null>(null), [analytics,setAnalytics]=useState<AnalyticsResponse|null>(null), [error,setError]=useState('');
  useEffect(()=>{Promise.all([hacApi.getReviewQueue({page:1,pageSize:6}),hacApi.getAnalytics()]).then(([q,a])=>{setQueue(q);setAnalytics(a)}).catch(e=>setError(e.message))},[]);
  const total=queue?.summaryCounts.total ?? 0;
  return <>
    <PageHeader title="HAC Signal Dashboard" subtitle="Operational view calculated only from claims currently stored in this environment." actions={<button className="btn primary" onClick={()=>nav('/claims/new')}><Plus size={16}/>Add claim</button>}/>
    {error&&<div className="card api-state api-error"><strong>Dashboard unavailable</strong><span>{error}</span></div>}
    <div className="stats-grid">
      <StatCard label="Cases loaded" value={queue?String(total):'—'} delta="Persistent backend store"/>
      <StatCard label="High priority" value={queue?String(queue.summaryCounts.highPriority):'—'} delta="Current scoring result"/>
      <StatCard label="In review" value={queue?String(queue.summaryCounts.inReview):'—'} delta="Human review workflow"/>
      <StatCard label="Confirmed" value={queue?String(queue.summaryCounts.confirmed):'—'} delta="Reviewer-confirmed cases"/>
    </div>
    {queue&&total===0?<div className="card empty-state dashboard-empty"><ShieldCheck size={30}/><strong>No claim data loaded</strong><span>This environment is intentionally empty. Add or import actual claim data; no demo or seed cases are created automatically.</span><button className="btn primary" onClick={()=>nav('/claims/new')}><Plus size={15}/>Add first claim</button></div>:<>
      <div className="dashboard-grid">
        <div className="card chart-card"><div className="card-title"><div><span>CASE MIX</span><h3>Current signal distribution</h3></div><BarChart3 size={20}/></div><div className="distribution-list">{analytics&&Object.entries(analytics.summary.signalDistribution).map(([k,v])=><div key={k}><span className={`distribution-dot ${k.toLowerCase()}`}/><strong>{k}</strong><b>{v}</b><small>{analytics.summary.totalCases?Math.round(v/analytics.summary.totalCases*100):0}%</small></div>)}</div></div>
        <div className="card chart-card"><div className="card-title"><div><span>REVIEW HEALTH</span><h3>Workflow status</h3></div><Activity size={20}/></div><div className="config-list"><div><span>Cases analyzed</span><strong>{analytics?.summary.totalCases??'—'}</strong></div><div><span>Average score</span><strong>{analytics?.summary.averageScore??'—'}</strong></div><div><span>Confirmed</span><strong>{analytics?.summary.confirmed??'—'}</strong></div><div><span>High priority</span><strong>{analytics?.summary.highPriority??'—'}</strong></div></div></div>
      </div>
      <div className="card"><div className="card-title"><div><span>NEEDS ATTENTION</span><h3>Highest-priority cases</h3></div><AlertTriangle size={20}/></div><div className="dashboard-case-list">{queue?.items.map(item=><button key={item.claimId} onClick={()=>nav(`/claims/${item.claimId}`)}><div><strong>{item.claimId}</strong><span>{item.patientId} · {item.providerDisplayName}</span></div><div className="dashboard-case-meta"><RiskBadge risk={item.signalLevel}/><StatusBadge status={item.reviewStatus.replaceAll('_',' ')}/><b>{item.score}</b><ArrowRight size={16}/></div></button>)}{queue?.items.length===0&&<div className="api-state"><CheckCircle2 size={18}/> No cases require attention.</div>}</div></div>
    </>}
  </>;
}
