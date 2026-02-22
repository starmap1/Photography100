import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function UploadArea({ week }: { week: number }) {
  const [files, setFiles] = useState<FileList | null>(null);
  const [status, setStatus] = useState<string>('');
  const [remaining, setRemaining] = useState<number | null>(null);

  async function fetchRemaining() {
    try {
      const session = await supabase.auth.getSession();
      const accessToken = session?.data?.session?.access_token;
      const res = await fetch(`/api/upload/quota?week=${week}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!res.ok) return;
      const j = await res.json();
      setRemaining(j.remaining);
    } catch (err) {
      console.warn('quota fetch error', err);
    }
  }

  React.useEffect(() => {
    fetchRemaining();
  }, [week]);

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!files || files.length === 0) return;
    setStatus('Preparing uploads...');
    const session = await supabase.auth.getSession();
    const accessToken = session?.data?.session?.access_token;
    if (!accessToken) return setStatus('Not authenticated');

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith('image/')) {
        setStatus('Only image files permitted.');
        return;
      }

      const res = await fetch('/api/presign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ week, filename: file.name, contentType: file.type }),
      });

      if (!res.ok) {
        const txt = await res.text();
        setStatus('Error requesting upload URL: ' + txt);
        return;
      }

      const j = await res.json();
      const uploadUrl = j.uploadUrl;

      setStatus(`Uploading ${file.name}...`);
      const put = await fetch(uploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file,
      });

      if (!put.ok) {
        setStatus('Upload failed for ' + file.name);
        return;
      }
      setStatus(`Uploaded ${file.name}`);
    }
    setStatus('All uploads complete. Processing...');
    fetchRemaining();
  }

  return (
    <div className="upload-area card">
      <p>Week {week} — upload up to 20 photos</p>
      <form onSubmit={handleUpload}>
        <input type="file" accept="image/*" multiple onChange={(e) => setFiles(e.target.files)} />
        <div className="btn-row">
          <button type="submit" className="btn">Upload</button>
        </div>
      </form>
      <div className="muted">Remaining this week: {remaining ?? '—'}</div>
      <div className="status">{status}</div>
    </div>
  );
}