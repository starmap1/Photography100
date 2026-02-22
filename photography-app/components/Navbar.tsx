import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function Navbar() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    async function getSession() {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user ?? null);
    }
    getSession();

    const { subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription?.unsubscribe();
  }, []);

  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link href="/">Photography100</Link>
      </div>
      <div className="nav-right">
        {user ? (
          <>
            <span className="muted">{user.email}</span>
            <button
              className="btn ghost"
              onClick={async () => {
                await supabase.auth.signOut();
                setUser(null);
                window.location.href = '/';
              }}
            >
              Sign out
            </button>
          </>
        ) : (
          <Link href="/login">
            <button className="btn">Sign in</button>
          </Link>
        )}
      </div>
    </nav>
  );
}