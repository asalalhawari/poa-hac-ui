import { ShieldCheck } from 'lucide-react';

export default function Login(){
  return <div className="login-page"><section className="login-panel"><div className="login-box"><ShieldCheck size={38}/><h2>Authentication is not configured</h2><p>This build does not simulate user authentication. Connect the application to your real SSO/identity provider before enabling sign-in.</p></div></section></div>;
}
