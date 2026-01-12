import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Script from 'next/script';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://runebox.eu';

interface LinkedProduct {
  id: number;
  title: string;
  slug: string;
  price: number;
  featured_image: string | null;
}

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  featured_image: string | null;
  author: string | null;
  meta_title: string | null;
  meta_description: string | null;
  og_image: string | null;
  tags: string | null;
  published_at: string | null;
  created_at: string;
  linked_products: LinkedProduct[];
}

async function getBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    // Use getApiEndpoint for consistent HTTPS handling (works for both SSR and client)
    const { getApiEndpoint } = await import('@/lib/api');
    const response = await fetch(getApiEndpoint(`/api/v1/blog/${slug}`), {
      next: { revalidate: 60 }, // Revalidate every 60 seconds
    });

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to fetch blog post:', error);
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getBlogPost(slug);

  if (!blog) {
    return {
      title: 'Статтю не знайдено | Rune box Blog',
    };
  }

  const metaTitle = blog.meta_title || `${blog.title} | Rune box Blog`;
  const metaDescription = blog.meta_description || blog.excerpt || blog.title;
  const ogImage = blog.og_image || blog.featured_image || `${siteUrl}/images/og/og-image.jpg`;
  const pageUrl = `${siteUrl}/blog/${blog.slug}`;

  return {
    title: metaTitle,
    description: metaDescription,

    keywords: blog.tags ? blog.tags.split(',').map(tag => tag.trim()) : [],

    authors: blog.author ? [{ name: blog.author }] : [{ name: 'Rune box Team' }],

    openGraph: {
      type: 'article',
      title: metaTitle,
      description: metaDescription,
      url: pageUrl,
      siteName: 'Rune Box',
      locale: 'en_US',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: blog.title,
        },
      ],
      publishedTime: blog.published_at || blog.created_at,
      authors: blog.author ? [blog.author] : ['Rune Box Team'],
      tags: blog.tags ? blog.tags.split(',').map(tag => tag.trim()) : [],
    },

    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description: metaDescription,
      images: [ogImage],
      creator: '@runebox',
      site: '@runebox',
    },

    alternates: {
      canonical: pageUrl,
    },

    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },

    other: {
      'article:published_time': blog.published_at || blog.created_at,
      'article:author': blog.author || 'Skrynia Team',
    },
  };
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('uk-UA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const blog = await getBlogPost(slug);

  if (!blog) {
    notFound();
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: blog.title,
    description: blog.meta_description || blog.excerpt || '',
    image: blog.og_image || blog.featured_image || '',
    datePublished: blog.published_at || blog.created_at,
    dateModified: blog.created_at,
    author: {
      '@type': blog.author ? 'Person' : 'Organization',
      name: blog.author || 'Rune box Team',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Rune box',
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/images/logo/logo-white-pink-1.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteUrl}/blog/${blog.slug}`,
    },
    articleSection: blog.tags || 'Blog',
    keywords: blog.tags || '',
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Головна',
        item: siteUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Блог',
        item: `${siteUrl}/blog`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: blog.title,
        item: `${siteUrl}/blog/${blog.slug}`,
      },
    ],
  };

  return (
    <>
      {/* JSON-LD Structured Data */}
      <Script
        id="blog-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        strategy="afterInteractive"
      />
      <Script
        id="breadcrumb-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
        strategy="afterInteractive"
      />

      <article className="min-h-screen bg-deep-black pt-24 pb-20" itemScope itemType="https://schema.org/BlogPosting">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            {/* Breadcrumbs */}
            <nav className="mb-8 text-sm" aria-label="Breadcrumb">
              <ol className="flex items-center gap-2 text-sage" itemScope itemType="https://schema.org/BreadcrumbList">
                <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                  <Link href="/" className="hover:text-ivory" itemProp="item">
                    <span itemProp="name">Головна</span>
                  </Link>
                  <meta itemProp="position" content="1" />
                </li>
                <li>/</li>
                <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                  <Link href="/blog" className="hover:text-ivory" itemProp="item">
                    <span itemProp="name">Блог</span>
                  </Link>
                  <meta itemProp="position" content="2" />
                </li>
                <li>/</li>
                <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                  <span className="text-ivory" itemProp="name">{blog.title}</span>
                  <meta itemProp="position" content="3" />
                </li>
              </ol>
            </nav>

            {/* Article Header */}
            <header className="mb-8">
              <div className="flex items-center gap-3 text-sm text-sage mb-4">
                <time dateTime={blog.published_at || blog.created_at} itemProp="datePublished">
                  {formatDate(blog.published_at || blog.created_at)}
                </time>
                {blog.author && (
                  <>
                    <span>•</span>
                    <span itemProp="author" itemScope itemType="https://schema.org/Person">
                      <span itemProp="name">{blog.author}</span>
                    </span>
                  </>
                )}
              </div>

              <h1 className="font-rutenia text-4xl md:text-5xl lg:text-6xl text-ivory mb-6 leading-tight" itemProp="headline">
                {blog.title}
              </h1>

              {blog.excerpt && (
                <p className="font-inter text-xl text-sage leading-relaxed mb-6" itemProp="description">
                  {blog.excerpt}
                </p>
              )}

              {blog.tags && (
                <div className="flex flex-wrap gap-2">
                  {blog.tags.split(',').map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-oxblood/20 text-oxblood text-sm rounded-full"
                      itemProp="keywords"
                    >
                      #{tag.trim()}
                    </span>
                  ))}
                </div>
              )}
            </header>

            {/* Featured Image */}
            {blog.featured_image && (
              <div className="relative w-full h-96 md:h-[500px] mb-12 rounded-sm overflow-hidden" itemProp="image" itemScope itemType="https://schema.org/ImageObject">
                <Image
                  src={blog.featured_image}
                  alt={blog.title}
                  fill
                  className="object-cover"
                  priority
                  itemProp="url"
                />
                <meta itemProp="width" content="1200" />
                <meta itemProp="height" content="630" />
              </div>
            )}

            {/* Article Content */}
            <div className="prose prose-invert prose-lg max-w-none mb-12" itemProp="articleBody">
              <ReactMarkdown
                components={{
                  h1: ({ children }) => (
                    <h2 className="font-rutenia text-3xl md:text-4xl text-ivory mb-4 mt-8">
                      {children}
                    </h2>
                  ),
                  h2: ({ children }) => (
                    <h3 className="font-rutenia text-2xl md:text-3xl text-ivory mb-3 mt-6">
                      {children}
                    </h3>
                  ),
                  h3: ({ children }) => (
                    <h4 className="font-rutenia text-xl md:text-2xl text-ivory mb-3 mt-4">
                      {children}
                    </h4>
                  ),
                  p: ({ children }) => (
                    <p className="font-inter text-sage text-lg leading-relaxed mb-4">
                      {children}
                    </p>
                  ),
                  a: ({ href, children }) => (
                    <a
                      href={href}
                      className="text-oxblood hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {children}
                    </a>
                  ),
                  ul: ({ children }) => (
                    <ul className="list-disc list-inside text-sage mb-4 space-y-2">
                      {children}
                    </ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="list-decimal list-inside text-sage mb-4 space-y-2">
                      {children}
                    </ol>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-oxblood pl-6 my-6 italic text-sage">
                      {children}
                    </blockquote>
                  ),
                  code: ({ children }) => (
                    <code className="px-2 py-1 bg-footer-black text-oxblood rounded text-sm">
                      {children}
                    </code>
                  ),
                }}
              >
                {blog.content}
              </ReactMarkdown>
            </div>

            {/* Linked Products */}
            {blog.linked_products && blog.linked_products.length > 0 && (
              <section className="border-t border-sage/20 pt-12">
                <h2 className="font-rutenia text-2xl md:text-3xl text-ivory mb-6">
                  Пов'язані Товари
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {blog.linked_products.map((product) => (
                    <Link
                      key={product.id}
                      href={`/products/${product.slug}`}
                      className="group bg-footer-black border border-sage/20 rounded-sm overflow-hidden hover:border-oxblood transition-colors"
                    >
                      {product.featured_image && (
                        <div className="relative h-48 bg-deep-black">
                          <Image
                            src={product.featured_image}
                            alt={product.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                      )}
                      <div className="p-4">
                        <h3 className="font-inter text-ivory text-sm mb-2 line-clamp-2 group-hover:text-oxblood transition-colors">
                          {product.title}
                        </h3>
                        <p className="font-inter text-sage text-sm font-semibold">
                          {product.price} zł
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Back to Blog */}
            <div className="mt-12 pt-8 border-t border-sage/20 text-center">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-oxblood hover:text-oxblood/80 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Повернутися до блогу
              </Link>
            </div>
          </div>
        </div>

        {/* Hidden metadata for schema */}
        <meta itemProp="dateModified" content={blog.created_at} />
        <div itemProp="publisher" itemScope itemType="https://schema.org/Organization" style={{ display: 'none' }}>
          <meta itemProp="name" content="Skrynia" />
          <div itemProp="logo" itemScope itemType="https://schema.org/ImageObject">
            <meta itemProp="url" content={`${siteUrl}/images/logo/logo-white-pink-1.png`} />
          </div>
        </div>
      </article>
    </>
  );
}
