import { ImageResponse } from 'next/og';

export const runtime = 'nodejs';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://runebox.eu';

export default async function OpenGraphImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const apiEndpoint = `${process.env.BACKEND_URL || 'http://backend:8000'}/api/v1/products/${slug}`;

  let title = 'Rune Box';
  let bg = `${siteUrl}/images/logo/logo-white-pink-1.png`;

  try {
    const res = await fetch(apiEndpoint, { next: { revalidate: 3600 } });
    if (res.ok) {
      const product = await res.json();
      title = product.title_en || product.title_uk || title;
      const imgPath = product.images?.find((i: any) => i.is_primary)?.image_url || product.primary_image;
      if (imgPath) {
        bg = imgPath.startsWith('http') ? imgPath : `${siteUrl}${imgPath.startsWith('/') ? '' : '/'}${imgPath}`;
      }
    }
  } catch (e) {
    console.error('OG Fetch Error:', e);
  }

  return new ImageResponse(
    (
      <div style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        position: 'relative',
        backgroundColor: '#0a0a0a',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        padding: '72px'
      }}>
        <img src={bg} alt="" style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: 0.8
        }} />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(90deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.8) 100%)'
        }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', position: 'relative' }}>
          <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '24px', letterSpacing: '2px', textTransform: 'uppercase' }}>
            Rune Box
          </span>
          <h1 style={{ color: '#fff', fontSize: '64px', fontWeight: 700, margin: 0, lineHeight: 1.1 }}>
            {title}
          </h1>
        </div>
      </div>
    ),
    size
  );
}
