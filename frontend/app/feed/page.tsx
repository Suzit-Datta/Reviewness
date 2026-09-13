'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PostCard } from '@/components/ui/PostCard';
import { getAllPosts } from '@/services/postService';
import { isLoggedIn } from '@/lib/auth';
import type { Post } from '@/types';

export default function FeedPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Gate: require login before showing anything
    if (!isLoggedIn()) {
      router.replace('/auth/login');
      return;
    }

    setAuthorized(true);

    getAllPosts()
      .then(setPosts)
      .catch(() => setError('Could not load the review feed. Please try again.'))
      .finally(() => setLoading(false));
  }, [router]);

  // Render nothing until login is confirmed — prevents the flash of content
  if (!authorized) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col bg-base-200">
      <Navbar />
      <main className="mx-auto w-full max-w-7xl flex-grow px-6 py-12">
        <h1 className="font-[family-name:var(--font-heading)] text-4xl font-bold text-neutral">
          Review Feed
        </h1>
        <p className="mt-2 text-lg text-secondary">
          The latest honest reviews from the community.
        </p>

        {loading && (
          <div className="mt-16 flex justify-center">
            <span className="loading loading-spinner loading-lg text-primary" />
          </div>
        )}

        {error && (
          <div className="mt-8 rounded-lg bg-error/10 px-4 py-3 text-error">{error}</div>
        )}

        {!loading && !error && posts.length === 0 && (
          <div className="mt-16 text-center text-secondary">
            No reviews yet. Be the first to post one!
          </div>
        )}

        {!loading && !error && posts.length > 0 && (
          <div className="mt-10 flex flex-col gap-6 max-w-2xl mx-auto">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}