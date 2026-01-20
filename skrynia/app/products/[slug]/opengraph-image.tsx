import { ImageResponse } from 'next/og';
import { getApiEndpoint, getApiUrl } from '@/lib/api';

export const runtime = 'nodejs';

export const size = {
  width: 1600,
  height: 840,
};

export const contentType = 'image/png';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://runebox.eu';

function resolveImageUrl(imageUrl: string | undefined | null): string | null {
  if (!imageUrl) return null;
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) return imageUrl;

  if (imageUrl.startsWith('/static/') || imageUrl.startsWith('/uploads/')) {
    const backendBase = getApiUrl().replace(/\/api$/, '').replace(/\/$/, '');
    return `${backendBase}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
  }

  return `${siteUrl}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
}

export default async function OpenGraphImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // ALWAYS use siteUrl/api/v1 - nginx proxies it to backend
  // This works in all environments (dev, prod, Docker)
  const apiEndpoint = `${siteUrl}/api/v1/products/${slug}`;

  let title = 'Rune Box';
  let imageUrl: string | null = null;

  try {
    const res = await fetch(apiEndpoint, { next: { revalidate: 3600 } });
    if (res.ok) {
      const product = await res.json();
      title = product.title_en || product.title_uk || title;
      const firstImage = product.images?.find((img: any) => img.is_primary) || product.images?.[0];
      imageUrl = resolveImageUrl(firstImage?.image_url || product.primary_image);
    }
  } catch {
    // ignore and render fallback
  }

  const bg = imageUrl || `${siteUrl}/images/logo/logo-white-pink-1.png`;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          position: 'relative',
          backgroundColor: '#0a0a0a',
          overflow: 'hidden',
        }}
      >
        <img
          src={bg}
          alt=""
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: 'contrast(1.05) saturate(1.05)',
          }}
        />

        {/* dark gradient overlay for readability */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(90deg, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.20) 55%, rgba(0,0,0,0.65) 100%)',
          }}
        />

        <div
          style={{
            position: 'absolute',
            left: 72,
            right: 72,
            bottom: 72,
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
          }}
        >
          <div
            style={{
              fontSize: 26,
              letterSpacing: 2,
              color: 'rgba(255,255,255,0.85)',
              textTransform: 'uppercase',
            }}
          >
            Rune Box
          </div>
          <div
            style={{
              fontSize: 64,
              fontWeight: 700,
              lineHeight: 1.05,
              color: '#fff',
              textShadow: '0 10px 40px rgba(0,0,0,0.55)',
              maxWidth: 1250,
            }}
          >
            {title}
          </div>
        </div>
      </div>
    ),
    size
  );
}


