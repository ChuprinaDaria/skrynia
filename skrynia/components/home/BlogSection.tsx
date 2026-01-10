'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getApiEndpoint } from '@/lib/api';
import { useLanguage } from '@/contexts/LanguageContext';

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  featured_image: string | null;
  author: string | null;
  published_at: string | null;
  created_at: string;
}

export default function BlogSection() {
  const { t } = useLanguage();
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await fetch(getApiEndpoint('/api/v1/blog?published_only=true&limit=3'));
      if (response.ok) {
        const data = await response.json();
        setBlogs(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Failed to fetch blogs:', error);
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

  return (
    <section className="py-20 md:py-32 px-4 bg-footer-black relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 parchment-texture opacity-5" aria-hidden="true" />

      <div className="container mx-auto relative z-10">
        <div className="text-center mb-12">
          <h2 className="font-rutenia text-4xl md:text-5xl text-ivory mb-4">
            Блог Skrynia
          </h2>
          <p className="font-inter text-sage text-lg max-w-2xl mx-auto">
            Дізнайтеся більше про традиції, символи та майстерність етнічних прикрас
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-oxblood"></div>
            <p className="text-sage mt-4">Завантаження статей...</p>
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-sage text-lg mb-6">Статті блогу з'являться найближчим часом</p>
            <Link
              href="/blog"
              className="inline-block px-8 py-4 border-2 border-oxblood text-oxblood rounded-sm font-inter font-semibold hover:bg-oxblood hover:text-ivory transition-all duration-300"
            >
              Перейти до блогу
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {blogs.map((blog) => (
            <article
              key={blog.id}
              className="bg-deep-black border border-sage/20 rounded-sm overflow-hidden hover:border-oxblood transition-all group"
            >
              <Link href={`/blog/${blog.slug}`} className="block">
                {blog.featured_image && (
                  <div className="relative h-64 bg-footer-black overflow-hidden">
                    <Image
                      src={blog.featured_image}
                      alt={blog.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}

                <div className="p-6">
                  <div className="flex items-center gap-2 text-xs text-sage mb-3">
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

                  <h3 className="font-rutenia text-xl md:text-2xl text-ivory mb-3 group-hover:text-oxblood transition-colors line-clamp-2">
                    {blog.title}
                  </h3>

                  {blog.excerpt && (
                    <p className="font-inter text-sage text-sm leading-relaxed mb-4 line-clamp-3">
                      {blog.excerpt}
                    </p>
                  )}

                  <div className="flex items-center gap-2 text-oxblood font-inter text-sm">
                    Читати далі
                    <svg
                      className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </Link>
            </article>
              ))}
            </div>

            <div className="text-center">
              <Link
                href="/blog"
                className="inline-block px-8 py-4 border-2 border-oxblood text-oxblood rounded-sm font-inter font-semibold hover:bg-oxblood hover:text-ivory transition-all duration-300"
              >
                Всі Статті Блогу
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
