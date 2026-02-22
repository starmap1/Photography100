import type { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin } from '../../../../lib/supabaseAdmin';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const {
      query: { id },
      method,
    } = req;

    if (method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const authHeader = (req.headers.authorization || '').replace('Bearer ', '');
    if (!authHeader) return res.status(401).json({ error: 'Missing access token' });

    const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(authHeader);
    if (userError || !userData?.user) return res.status(401).json({ error: 'Invalid token' });

    const user = userData.user;
    const role = (user.user_metadata as any)?.role || (user.app_metadata as any)?.role;
    if (role !== 'teacher') return res.status(403).json({ error: 'Teacher role required' });

    const body = req.body || {};
    const newStatus = body.status;
    if (!['active', 'rejected'].includes(newStatus)) {
      return res.status(400).json({ error: 'Invalid status. Must be active or rejected' });
    }

    const { data, error: updateError } = await supabaseAdmin
      .from('photos')
      .update({ status: newStatus })
      .eq('id', id)
      .select()
      .single();

    if (updateError) throw updateError;

    res.status(200).json({ ok: true, photo: data });
  } catch (err: any) {
    console.error('POST /api/teacher/photo/[id] error', err);
    res.status(500).json({ error: err.message || String(err) });
  }
}