'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Script from 'next/script';
import { getApiEndpoint } from '@/lib/api';
import { useLanguage } from '@/contexts/LanguageContext';

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  featured_image: string | null;
  author: string | null;
  tags: string | null;
  published_at: string | null;
  created_at: string;
}

export default function BlogPage() {
  const { t, language } = useLanguage();
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await fetch(getApiEndpoint('/api/v1/blog?published_only=true&limit=100'));
      if (response.ok) {
        const data = await response.json();
        setBlogs(data);
      } else {
        console.error('Failed to fetch blogs:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Failed to fetch blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const langMap: Record<string, string> = {
      'UA': 'uk-UA',
      'EN': 'en-US',
      'DE': 'de-DE',
      'PL': 'pl-PL',
      'SE': 'sv-SE',
      'NO': 'no-NO',
      'DK': 'da-DK',
      'FR': 'fr-FR',
    };
    const locale = langMap[language || 'UA'] || 'uk-UA';
    return new Date(dateString).toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://runebox.eu';

  // Generate JSON-LD structured data for blog listing
  const blogListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: t.blog.title,
    description: t.blog.subtitle,
    url: `${siteUrl}/blog`,
    publisher: {
      '@type': 'Organization',
      name: 'Rune Box',
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/images/logo/logo-white-pink-1.png`,
      },
    },
    blogPost: blogs.map((blog) => ({
      '@type': 'BlogPosting',
      headline: blog.title,
      description: blog.excerpt || '',
      image: blog.featured_image || `${siteUrl}/images/logo/logo-white-pink-1.png`,
      url: `${siteUrl}/blog/${blog.slug}`,
      datePublished: blog.published_at || blog.created_at,
      author: {
        '@type': blog.author ? 'Person' : 'Organization',
        name: blog.author || 'Rune Box Team',
      },
    })),
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
    ],
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-deep-black pt-24 pb-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center text-sage">{t.blog.loading}</div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* JSON-LD структуровані дані */}
      <Script
        id="blog-list-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogListJsonLd) }}
        strategy="afterInteractive"
      />
      <Script
        id="blog-breadcrumb-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
        strategy="afterInteractive"
      />
      <div className="min-h-screen bg-deep-black pt-24 pb-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <header className="mb-12 text-center">
            <h1 className="font-rutenia text-5xl md:text-6xl text-ivory mb-4">
              {t.blog.title}
            </h1>
            <p className="font-inter text-sage text-lg">
              {t.blog.subtitle}
            </p>
          </header>

          {blogs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-sage text-lg">{t.blog.noPosts}</p>
            </div>
          ) : (
            <div className="space-y-8">
              {blogs.map((blog) => (
                <article
                  key={blog.id}
                  className="bg-footer-black border border-sage/20 rounded-sm overflow-hidden hover:border-sage/40 transition-all group"
                >
                  <Link href={`/blog/${blog.slug}`} className="block">
                    <div className="grid md:grid-cols-3 gap-6">
                      {blog.featured_image && (
                        <div className="md:col-span-1 relative h-64 md:h-auto bg-deep-black">
                          <Image
                            src={blog.featured_image}
                            alt={blog.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}

                      <div className={`${blog.featured_image ? 'md:col-span-2' : 'md:col-span-3'} p-6`}>
                        <div className="flex items-center gap-3 text-xs text-sage mb-3">
                          <time dateTime={blog.published_at || blog.created_at}>
                            {formatDate(blog.published_at || blog.created_at)}
                          </time>
                          {blog.author && (
                            <>
                              <span>•</span>
                              <span>{blog.author}</span>
                            </>
                          )}
                          {blog.tags && (
                            <>
                              <span>•</span>
                              <div className="flex gap-2">
                                {blog.tags.split(',').slice(0, 2).map((tag, idx) => (
                                  <span key={idx} className="text-oxblood">
                                    #{tag.trim()}
                                  </span>
                                ))}
                              </div>
                            </>
                          )}
                        </div>

                        <h2 className="font-rutenia text-2xl md:text-3xl text-ivory mb-3 group-hover:text-oxblood transition-colors">
                          {blog.title}
                        </h2>

                        {blog.excerpt && (
                          <p className="font-inter text-sage leading-relaxed mb-4">
                            {blog.excerpt}
                          </p>
                        )}

                        <div className="flex items-center gap-2 text-oxblood font-inter text-sm">
                          {t.blog.readMore}
                          <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  );
}
