import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import UploadArea from '../../components/UploadArea';
import Gallery from '../../components/Gallery';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function WeekPage() {
  const router = useRouter();
  const { week } = router.query;
  const [pptUrl, setPptUrl] = useState<string | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  useEffect(() => {
    // For MVP we assume PPTs and PDFs live on CloudFront domain under /ppts/week-XX.pdf/.pptx
    if (!week) return;
    const w = String(week).padStart(2, '0');
    const base = process.env.NEXT_PUBLIC_CLOUDFRONT_DOMAIN
      ? `https://${process.env.NEXT_PUBLIC_CLOUDFRONT_DOMAIN}`
      : '';
    setPptUrl(base ? `${base}/ppts/week-${w}.pptx` : null);
    setPdfUrl(base ? `${base}/ppts/week-${w}.pdf` : null);
  }, [week]);

  return (
    <div className="page">
      <h1>Week {week}</h1>

      <section className="card">
        <h2>Presentation</h2>
        {pdfUrl ? (
          <div className="ppt-embed">
            <iframe src={pdfUrl} title={`Week ${week} slides`} />
          </div>
        ) : (
          <p>No PDF available. Download PPTX: {pptUrl ? <a href={pptUrl}>Download</a> : 'N/A'}</p>
        )}
      </section>

      <section className="card">
        <h2>Your uploads</h2>
        <UploadArea week={Number(week)} />
      </section>

      <section className="card">
        <h2>Gallery</h2>
        <Gallery week={Number(week)} />
      </section>
    </div>
  );
}