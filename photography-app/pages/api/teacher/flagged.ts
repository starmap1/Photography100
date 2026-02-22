import type { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin } from '../../../lib/supabaseAdmin';

/**
 * Returns flagged photos for teacher review.
 * Authorization: requires a logged-in user with user_metadata.role === 'teacher'
 * (Adjust the role check to match your user model.)
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const authHeader = (req.headers.authorization || '').replace('Bearer ', '');
    if (!authHeader) return res.status(401).json({ error: 'Missing access token' });

    const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(authHeader);
    if (userError || !userData?.user) return res.status(401).json({ error: 'Invalid token' });

    const user = userData.user;
    const role = (user.user_metadata as any)?.role || (user.app_metadata as any)?.role;
    if (role !== 'teacher') return res.status(403).json({ error: 'Teacher role required' });

    const { data, error } = await supabaseAdmin
      .from('photos')
      .select('id, student_user_id, week, thumbnail_s3_key, s3_key, status, created_at')
      .eq('status', 'flagged')
      .order('created_at', { ascending: false })
      .limit(200);

    if (error) throw error;

    res.status(200).json(data);
  } catch (err: any) {
    console.error('GET /api/teacher/flagged error', err);
    res.status(500).json({ error: err.message || String(err) });
  }
}