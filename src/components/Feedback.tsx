import { AlertCircle, CheckCircle2, Info, X, XCircle } from 'lucide-react';
import { createContext, ReactNode, useContext, useMemo, useState } from 'react';

type ToastTone='success'|'error'|'info'|'warning';
type Toast={id:number;tone:ToastTone;title:string;message?:string};
const ToastContext=createContext<{show:(tone:ToastTone,title:string,message?:string)=>void}|null>(null);
export function ToastProvider({children}:{children:ReactNode}){
  const [items,setItems]=useState<Toast[]>([]);
  const api=useMemo(()=>({show:(tone:ToastTone,title:string,message?:string)=>{const id=Date.now()+Math.random();setItems(v=>[...v,{id,tone,title,message}]);setTimeout(()=>setItems(v=>v.filter(x=>x.id!==id)),3600)}}),[]);
  return <ToastContext.Provider value={api}>{children}<div className="toast-stack">{items.map(t=><div key={t.id} className={`toast toast-${t.tone}`}>{t.tone==='success'?<CheckCircle2/>:t.tone==='error'?<XCircle/>:t.tone==='warning'?<AlertCircle/>:<Info/>}<div><strong>{t.title}</strong>{t.message&&<span>{t.message}</span>}</div><button onClick={()=>setItems(v=>v.filter(x=>x.id!==t.id))}><X size={15}/></button></div>)}</div></ToastContext.Provider>
}
export function useToast(){const c=useContext(ToastContext);if(!c)throw new Error('useToast must be used inside ToastProvider');return c;}

export function Modal({open,title,subtitle,children,onClose,footer,size='md'}:{open:boolean;title:string;subtitle?:string;children:ReactNode;onClose:()=>void;footer?:ReactNode;size?:'sm'|'md'|'lg'}){
  if(!open)return null; return <div className="modal-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)onClose()}}><section className={`app-modal modal-${size}`} role="dialog" aria-modal="true"><header><div><h2>{title}</h2>{subtitle&&<p>{subtitle}</p>}</div><button className="icon-btn" onClick={onClose}><X size={18}/></button></header><div className="modal-body">{children}</div>{footer&&<footer>{footer}</footer>}</section></div>
}
export function ConfirmDialog({open,title,message,confirmLabel='Confirm',danger=false,busy=false,onCancel,onConfirm}:{open:boolean;title:string;message:string;confirmLabel?:string;danger?:boolean;busy?:boolean;onCancel:()=>void;onConfirm:()=>void}){
 return <Modal open={open} title={title} subtitle={message} onClose={onCancel} size="sm" footer={<><button className="btn outline" onClick={onCancel} disabled={busy}>Cancel</button><button className={`btn ${danger?'danger-btn':'primary'}`} onClick={onConfirm} disabled={busy}>{busy?'Please wait…':confirmLabel}</button></>}>{danger&&<div className="confirm-warning"><AlertCircle size={18}/>This action cannot be undone.</div>}</Modal>
}
