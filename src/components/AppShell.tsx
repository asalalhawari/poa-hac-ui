import { NavLink, Outlet } from 'react-router-dom';
import { BarChart3, BookOpen, LayoutDashboard, Settings, ShieldCheck, UserRoundSearch } from 'lucide-react';

const nav = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/claims', label: 'Review Queue', icon: UserRoundSearch },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/code-reference', label: 'Clinical Reference', icon: BookOpen },
];

export default function AppShell() {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand"><ShieldCheck size={30}/><span>HAC Signal</span></div>
        <nav>{nav.map(({to,label,icon:Icon}) => <NavLink key={to} to={to} className={({isActive})=>isActive?'nav-item active':'nav-item'}><Icon size={18}/><span>{label}</span></NavLink>)}</nav>
        <div className="sidebar-spacer" />
        <NavLink to="/settings" className={({isActive})=>isActive?'nav-item active':'nav-item'}><Settings size={18}/><span>Settings</span></NavLink>
      </aside>
      <main className="content"><Outlet /></main>
    </div>
  );
}
