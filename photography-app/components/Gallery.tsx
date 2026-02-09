import { useEffect, useState } from 'react';

type Photo = {
  id: string;
  thumbnail_s3_key?: string | null;
  s3_key: string;
  status: string;
};

export default function Gallery({ week }: { week: number }) {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(false);

  async function fetchPhotos() {
    setLoading(true);
    try {
      const res = await fetch(`/api/photos?week=${week}`);
      if (!res.ok) throw new Error(await res.text());
      const j = await res.json();
      setPhotos(j);
    } catch (err) {
      console.error(err);
      alert('Error loading photos');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!week) return;
    fetchPhotos();
  }, [week]);

  if (loading) return <div>Loading gallery...</div>;
  if (photos.length === 0) return <div>No photos yet for this week.</div>;

  return (
    <div className="gallery-grid">
      {photos.map((p) => (
        <div key={p.id} className="gallery-item">
          <img
            src={
              p.thumbnail_s3_key
                ? `${process.env.NEXT_PUBLIC_CLOUDFRONT_DOMAIN ? `https://${process.env.NEXT_PUBLIC_CLOUDFRONT_DOMAIN}/${p.thumbnail_s3_key}` : p.thumbnail_s3_key}`
                : '/placeholder.png'
            }
            alt="student upload"
          />
        </div>
      ))}
    </div>
  );
}