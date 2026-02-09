import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

type Photo = {
  id: string;
  student_user_id: string;
  week: number;
  thumbnail_s3_key?: string | null;
  s3_key: string;
  status: string;
  created_at: string;
};

export default function TeacherDashboard() {
  const [flagged, setFlagged] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(false);

  async function fetchFlagged() {
    setLoading(true);
    try {
      // This assumes you have an API endpoint /api/teacher/flagged that requires teacher auth
      const res = await fetch('/api/teacher/flagged');
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setFlagged(data);
    } catch (err) {
      console.error(err);
      alert('Error loading flagged photos');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchFlagged();
  }, []);

  async function updateStatus(id: string, status: 'active' | 'rejected') {
    try {
      const res = await fetch(`/api/teacher/photo/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error(await res.text());
      setFlagged((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error(err);
      alert('Error updating photo');
    }
  }

  return (
    <div className="page">
      <h1>Teacher Dashboard</h1>

      <section className="card">
        <h2>Flagged / Pending Photos</h2>
        {loading ? (
          <p>Loading...</p>
        ) : flagged.length === 0 ? (
          <p>No flagged photos.</p>
        ) : (
          <ul className="photo-list">
            {flagged.map((p) => (
              <li key={p.id} className="photo-item">
                <div className="photo-thumb">
                  {p.thumbnail_s3_key ? (
                    <img src={`${process.env.NEXT_PUBLIC_CLOUDFRONT_DOMAIN ? `https://${process.env.NEXT_PUBLIC_CLOUDFRONT_DOMAIN}/${p.thumbnail_s3_key}` : p.thumbnail_s3_key}`} alt="thumb" />
                  ) : (
                    <div className="placeholder">No thumb</div>
                  )}
                </div>
                <div className="photo-meta">
                  <div>Student: {p.student_user_id}</div>
                  <div>Week: {p.week}</div>
                  <div>Uploaded: {new Date(p.created_at).toLocaleString()}</div>
                  <div className="btn-row">
                    <button className="btn" onClick={() => updateStatus(p.id, 'active')}>Approve</button>
                    <button className="btn ghost" onClick={() => updateStatus(p.id, 'rejected')}>Reject</button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}