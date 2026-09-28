import { Activity, BarChart3, CalendarClock, CheckCircle2, RefreshCw, ShieldAlert } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { hacApi } from '../api/hacApi';
import type { AnalyticsResponse } from '../api/hacTypes';
import { useToast } from '../components/Feedback';
import { PageHeader, StatCard } from '../components/UI';

export default function Analytics(){
 const [data,setData]=useState<AnalyticsResponse|null>(null);const[loading,setLoading]=useState(true);const[error,setError]=useState('');const toast=useToast();
 const load=()=>{setLoading(true);setError('');hacApi.getAnalytics().then(setData).catch(e=>setError(e.message)).finally(()=>setLoading(false))}; useEffect(load,[]);
 const componentData=data?[{name:'Coding evidence',value:data.componentTotals.coding},{name:'Timing / POA',value:data.componentTotals.timing},{name:'Clinical relatedness',value:data.componentTotals.relatedness},{name:'Intervention',value:data.componentTotals.intervention},{name:'Provider history',value:data.componentTotals.history}]:[];
 return <>
  <PageHeader title="HAC Signal Analytics" subtitle="Live analytics calculated from the claims currently held by the backend service." actions={<button className="btn outline" onClick={()=>{load();toast.show('info','Analytics refreshed','Latest backend claim data is being recalculated.')}}><RefreshCw size={15}/>Refresh</button>}/>
  {loading&&<div className="card api-state">Calculating live analytics…</div>}{error&&<div className="card api-state api-error"><strong>Analytics unavailable</strong><span>{error}</span></div>}
  {data&&<><div className="analytics-meta"><CalendarClock size={15}/><span>Calculated {new Date(data.generatedAt).toLocaleString()} from the active backend claim store.</span></div>
  <div className="stats-grid"><StatCard label="Cases analyzed" value={String(data.summary.totalCases)} delta="Current backend registry"/><StatCard label="Average signal score" value={String(data.summary.averageScore)} delta="Across all active cases"/><StatCard label="High priority cases" value={String(data.summary.highPriority)} delta={`${data.summary.totalCases?Math.round(data.summary.highPriority/data.summary.totalCases*100):0}% of current cases`}/><StatCard label="Confirmed by reviewers" value={String(data.summary.confirmed)} delta="Human review decisions"/></div>
  <div className="dashboard-grid"><div className="card chart-card"><div className="card-title"><div><span>EVIDENCE CONTRIBUTION</span><h3>Signal points by evidence area</h3></div><BarChart3 size={20}/></div><ResponsiveContainer width="100%" height={300}><BarChart data={componentData} margin={{left:8,right:10,top:12,bottom:45}}><CartesianGrid strokeDasharray="3 3" vertical={false}/><XAxis dataKey="name" angle={-20} textAnchor="end" interval={0} height={70}/><YAxis/><Tooltip/><Bar dataKey="value" fill="#1769d2" radius={[7,7,0,0]}/></BarChart></ResponsiveContainer></div>
  <div className="card chart-card"><div className="card-title"><div><span>DIAGNOSIS PATTERNS</span><h3>Top diagnosis codes by average score</h3></div><Activity size={20}/></div><ResponsiveContainer width="100%" height={300}><BarChart layout="vertical" data={data.topDiagnoses}><CartesianGrid strokeDasharray="3 3" horizontal={false}/><XAxis type="number" domain={[0,100]}/><YAxis dataKey="code" type="category" width={80}/><Tooltip/><Bar dataKey="averageScore" fill="#1769d2" radius={[0,7,7,0]}/></BarChart></ResponsiveContainer></div></div>
  <div className="analytics-bottom-grid"><div className="card analytics-panel"><div className="card-title"><div><span>SIGNAL DISTRIBUTION</span><h3>Current case mix</h3></div><ShieldAlert size={20}/></div><div className="distribution-list">{Object.entries(data.summary.signalDistribution).map(([k,v])=><div key={k}><span className={`distribution-dot ${k.toLowerCase()}`}/><strong>{k}</strong><b>{v}</b><small>{data.summary.totalCases?Math.round(v/data.summary.totalCases*100):0}%</small></div>)}</div></div>
  <div className="card analytics-panel"><div className="card-title"><div><span>PROVIDER VIEW</span><h3>Provider signal summary</h3></div><CheckCircle2 size={20}/></div><div className="provider-list">{data.providers.map(p=><div key={p.providerId}><span><strong>{p.provider}</strong><small>{p.cases} cases · {p.high} high</small></span><b>{p.averageScore}<small> avg</small></b></div>)}{data.providers.length===0&&<div className="empty-state">No provider data available.</div>}</div></div></div></>}
 </>
}
