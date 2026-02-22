import type { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin } from '../../lib/supabaseAdmin';

function buildPublicUrl(key: string) {
  const cdn = process.env.NEXT_PUBLIC_CLOUDFRONT_DOMAIN || process.env.CLOUDFRONT_DOMAIN || '';
  if (!key) return null;
  if (cdn) return `https://${cdn}/${key}`;
  const bucket = process.env.S3_BUCKET_NAME;
  const region = process.env.S3_REGION || 'us-east-1';
  if (!bucket) return `/assets/${key}`;
  return `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const week = Number(req.query.week);
    if (!week) return res.status(400).json({ error: 'Missing week parameter' });

    const { data, error } = await supabaseAdmin
      .from('photos')
      .select('id, student_user_id, week, thumbnail_s3_key, s3_key, status, created_at')
      .eq('week', week)
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (error) throw error;

    const rows = (data || []).map((r: any) => ({
      ...r,
      thumbnail_url: r.thumbnail_s3_key ? buildPublicUrl(r.thumbnail_s3_key) : null,
      original_url: r.s3_key ? buildPublicUrl(r.s3_key) : null,
    }));

    res.status(200).json(rows);
  } catch (err: any) {
    console.error('GET /api/photos error', err);
    res.status(500).json({ error: err.message || String(err) });
  }
}