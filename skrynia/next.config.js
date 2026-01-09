/** @type {import('next').NextConfig} */
const nextConfig = {
  // Standalone output for Docker
  output: 'standalone',
  
  // SEO та оптимізація зображень
  images: {
    // Вимикаємо built-in image optimization (sharp/libvips), бо на деяких CPU/VM
    // prebuilt-бінарники можуть падати з "Illegal instruction".
    // Next/Image буде віддавати оригінальні файли з /public або remote URL без оптимізації.
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1 рік
  },
  
  // Компресія та оптимізація
  compress: true,
  
  // Строгий режим React
  reactStrictMode: true,
  
  // Power by header видалення для безпеки
  poweredByHeader: false,
  
  // Заголовки безпеки та кешування
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
      // Кешування статичних файлів
      {
        source: '/images/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/icons/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // Кешування шрифтів
      {
        source: '/fonts/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
  
  // Редіректи для SEO
  async redirects() {
    return [
      // Редірект з runebox.online на runebox.eu
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'runebox.online',
          },
        ],
        destination: 'https://runebox.eu/:path*',
        permanent: true,
      },
      // Редірект з runebox.pl на runebox.eu
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'runebox.pl',
          },
        ],
        destination: 'https://runebox.eu/:path*',
        permanent: true,
      },
      // www до non-www редірект для runebox.eu
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'www.runebox.eu',
          },
        ],
        destination: 'https://runebox.eu/:path*',
        permanent: true,
      },
      // Trailing slash редірект
      {
        source: '/:path+/',
        destination: '/:path+',
        permanent: true,
      },
    ];
  },
  
  // Env для SEO
  env: {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'https://runebox.eu',
  },
};

module.exports = nextConfig;
