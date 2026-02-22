import type { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin } from '../../../lib/supabaseAdmin';

const WEEK_QUOTA = 20;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const week = Number(req.query.week);
    if (!week) return res.status(400).json({ error: 'Missing week query param' });

    const authHeader = (req.headers.authorization || '').replace('Bearer ', '');
    if (!authHeader) return res.status(401).json({ error: 'Missing access token' });

    const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(authHeader);
    if (userError || !userData?.user) return res.status(401).json({ error: 'Invalid token' });

    const userId = userData.user.id;

    const { count, error: countError } = await supabaseAdmin
      .from('photos')
      .select('id', { count: 'exact', head: true })
      .eq('student_user_id', userId)
      .eq('week', week)
      .in('status', ['uploading', 'active']);

    if (countError) throw countError;

    const existing = typeof count === 'number' ? count : 0;
    const remaining = Math.max(0, WEEK_QUOTA - existing);

    res.status(200).json({ remaining, quota: WEEK_QUOTA, used: existing });
  } catch (err: any) {
    console.error('GET /api/upload/quota error', err);
    res.status(500).json({ error: err.message || String(err) });
  }
}