'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import Image from 'next/image';

interface BlogPost {
  id: number;
  title: string;
  content: string;
  featured_image?: string;
  video_url?: string;
  published_at: string;
  views_count: number;
  average_rating: number;
}

interface Comment {
  id: number;
  user_id: number;
  content: string;
  created_at: string;
}

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [post, setPost] = useState<BlogPost | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      fetchPost();
      fetchComments();
    }
  }, [slug]);

  const fetchPost = async () => {
    try {
      const res = await fetch(`http://localhost:8000/api/v1/blog/posts/${slug}`);
      if (res.ok) {
        const data = await res.json();
        setPost(data);
      }
    } catch (error) {
      console.error('Error fetching post:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const res = await fetch(`http://localhost:8000/api/v1/blog/posts/${post?.id}/comments`);
      if (res.ok) {
        const data = await res.json();
        setComments(data);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('auth_token');

    if (!token) {
      alert('Будь ласка, увійдіть щоб залишити коментар');
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:8000/api/v1/blog/posts/${post?.id}/comments`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ content: newComment }),
        }
      );

      if (res.ok) {
        setNewComment('');
        fetchComments();
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  };

  const handleRating = async (value: number) => {
    const token = localStorage.getItem('auth_token');

    if (!token) {
      alert('Будь ласка, увійдіть щоб оцінити статтю');
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:8000/api/v1/blog/posts/${post?.id}/ratings`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ rating: value }),
        }
      );

      if (res.ok) {
        setRating(value);
        fetchPost(); // Refresh to get updated average rating
      }
    } catch (error) {
      console.error('Error submitting rating:', error);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">Завантаження...</div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">Стаття не знайдена</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs
        items={[
          { label: 'Блог', href: '/blog' },
          { label: post.title },
        ]}
      />

      <article className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl md:text-5xl font-cinzel mb-4">{post.title}</h1>
          <div className="flex items-center text-sm text-gray-500 space-x-4">
            <span>{new Date(post.published_at).toLocaleDateString('uk-UA')}</span>
            <span>{post.views_count} переглядів</span>
            {post.average_rating > 0 && (
              <span className="flex items-center">
                <svg
                  className="w-4 h-4 text-yellow-400 mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                {post.average_rating.toFixed(1)}
              </span>
            )}
          </div>
        </header>

        {post.featured_image && (
          <div className="relative h-96 w-full mb-8 rounded-lg overflow-hidden">
            <Image
              src={post.featured_image}
              alt={post.title}
              fill
              className="object-cover"
            />
          </div>
        )}

        {post.video_url && (
          <div className="mb-8 aspect-video">
            <iframe
              src={post.video_url}
              className="w-full h-full rounded-lg"
              allowFullScreen
            />
          </div>
        )}

        <div
          className="prose prose-lg max-w-none mb-12"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Rating Section */}
        <div className="border-t border-b border-gray-200 py-8 mb-8">
          <h3 className="text-xl font-semibold mb-4">Оцініть статтю</h3>
          <div className="flex space-x-2">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                onClick={() => handleRating(value)}
                className="focus:outline-none"
              >
                <svg
                  className={`w-8 h-8 ${
                    value <= (rating || post.average_rating)
                      ? 'text-yellow-400'
                      : 'text-gray-300'
                  } hover:text-yellow-400 transition-colors`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </button>
            ))}
          </div>
        </div>

        {/* Comments Section */}
        <div className="mb-8">
          <h3 className="text-2xl font-semibold mb-6">
            Коментарі ({comments.length})
          </h3>

          <form onSubmit={handleSubmitComment} className="mb-8">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Залиште свій коментар..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-oxblood focus:border-transparent resize-none"
              rows={4}
              required
            />
            <button
              type="submit"
              className="mt-3 px-6 py-2 bg-oxblood text-white rounded-lg hover:bg-oxblood/90 transition-colors"
            >
              Додати коментар
            </button>
          </form>

          <div className="space-y-6">
            {comments.map((comment) => (
              <div
                key={comment.id}
                className="bg-gray-50 rounded-lg p-6"
              >
                <p className="text-gray-800 mb-2">{comment.content}</p>
                <p className="text-sm text-gray-500">
                  {new Date(comment.created_at).toLocaleDateString('uk-UA')}
                </p>
              </div>
            ))}
          </div>
        </div>
      </article>
    </div>
  );
}
