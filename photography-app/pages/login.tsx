import { supabase } from '../lib/supabaseClient';

export default function Login() {
  async function signInProvider(provider: 'google' | 'azure') {
    try {
      await supabase.auth.signInWithOAuth({
        provider: provider === 'azure' ? 'azure' : 'google',
        options: {
          // redirect to the site root after login
          redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? ''}/`,
        },
      });
    } catch (err) {
      console.error('Sign in error', err);
      alert('Error signing in: ' + String(err));
    }
  }

  return (
    <div className="page card">
      <h1>Sign in</h1>
      <p>Sign in with your school account (Google or Microsoft)</p>
      <div className="btn-row">
        <button className="btn" onClick={() => signInProvider('google')}>
          Continue with Google
        </button>
        <button className="btn ghost" onClick={() => signInProvider('azure')}>
          Continue with Microsoft
        </button>
      </div>
    </div>
  );
}