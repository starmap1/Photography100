import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { createClient } from '@supabase/supabase-js';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}