'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Head from 'next/head';
import ReactMarkdown from 'react-markdown';
import { getApiEndpoint } from '@/lib/api';

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

export default function BlogDetailPage() {
  const params = useParams();
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (params.slug) {
      fetchBlog(params.slug as string);
    }
  }, [params.slug]);

  const fetchBlog = async (slug: string) => {
    try {
      const response = await fetch(getApiEndpoint(`/api/v1/blog/${slug}`));
      if (!response.ok) {
        throw new Error('Blog post not found');
      }
      const data = await response.json();
      setBlog(data);

      // Set page title dynamically
      if (typeof window !== 'undefined') {
        document.title = data.meta_title || `${data.title} | Skrynia Blog`;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load blog post');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('uk-UA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const generateJsonLd = () => {
    if (!blog) return null;

    return {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: blog.title,
      description: blog.meta_description || blog.excerpt || '',
      image: blog.og_image || blog.featured_image || '',
      datePublished: blog.published_at || blog.created_at,
      dateModified: blog.created_at,
      author: {
        '@type': 'Organization',
        name: blog.author || 'Skrynia Team',
      },
      publisher: {
        '@type': 'Organization',
        name: 'Skrynia',
        logo: {
          '@type': 'ImageObject',
          url: 'https://runebox.eu/images/logo.png',
        },
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `https://runebox.eu/blog/${blog.slug}`,
      },
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-deep-black pt-24 pb-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center text-sage">Завантаження...</div>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-deep-black pt-24 pb-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="font-rutenia text-4xl text-ivory mb-4">Статтю не знайдено</h1>
            <p className="text-sage mb-6">{error}</p>
            <Link
              href="/blog"
              className="inline-block px-6 py-3 bg-oxblood text-ivory rounded-sm hover:bg-oxblood/90 transition-colors"
            >
              Повернутися до блогу
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const metaTitle = blog.meta_title || `${blog.title} | Skrynia Blog`;
  const metaDescription = blog.meta_description || blog.excerpt || blog.title;
  const ogImage = blog.og_image || blog.featured_image || '/images/og-default.jpg';

  return (
    <>
      <Head>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
        
        {/* Open Graph */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:url" content={`https://runebox.eu/blog/${blog.slug}`} />
        <meta property="article:published_time" content={blog.published_at || blog.created_at} />
        <meta property="article:author" content={blog.author || 'Skrynia Team'} />
        {blog.tags && blog.tags.split(',').map((tag, idx) => (
          <meta key={idx} property="article:tag" content={tag.trim()} />
        ))}
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metaTitle} />
        <meta name="twitter:description" content={metaDescription} />
        <meta name="twitter:image" content={ogImage} />

        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(generateJsonLd()) }}
        />
      </Head>

      <article className="min-h-screen bg-deep-black pt-24 pb-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            {/* Breadcrumbs */}
            <nav className="mb-8 text-sm">
              <ol className="flex items-center gap-2 text-sage">
                <li>
                  <Link href="/" className="hover:text-ivory">Головна</Link>
                </li>
                <li>/</li>
                <li>
                  <Link href="/blog" className="hover:text-ivory">Блог</Link>
                </li>
                <li>/</li>
                <li className="text-ivory">{blog.title}</li>
              </ol>
            </nav>

            {/* Article Header */}
            <header className="mb-8">
              <div className="flex items-center gap-3 text-sm text-sage mb-4">
                <time dateTime={blog.published_at || blog.created_at}>
                  {formatDate(blog.published_at || blog.created_at)}
                </time>
                {blog.author && (
                  <>
                    <span>•</span>
                    <span>{blog.author}</span>
                  </>
                )}
              </div>

              <h1 className="font-rutenia text-4xl md:text-5xl lg:text-6xl text-ivory mb-6 leading-tight">
                {blog.title}
              </h1>

              {blog.excerpt && (
                <p className="font-inter text-xl text-sage leading-relaxed mb-6">
                  {blog.excerpt}
                </p>
              )}

              {blog.tags && (
                <div className="flex flex-wrap gap-2">
                  {blog.tags.split(',').map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-oxblood/20 text-oxblood text-sm rounded-full"
                    >
                      #{tag.trim()}
                    </span>
                  ))}
                </div>
              )}
            </header>

            {/* Featured Image */}
            {blog.featured_image && (
              <div className="relative w-full h-96 md:h-[500px] mb-12 rounded-sm overflow-hidden">
                <Image
                  src={blog.featured_image}
                  alt={blog.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}

            {/* Article Content */}
            <div className="prose prose-invert prose-lg max-w-none mb-12">
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
      </article>
    </>
  );
}
