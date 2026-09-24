"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PostCard } from "@/components/ui/PostCard";
import { deletePost, getPostsByUserId } from "@/services/postService";
import { isLoggedIn } from "@/lib/auth";
import type { Post } from "@/types";

export default function MyPostsPage() {
  const router = useRouter();

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadPosts() {
    const userId = Number(localStorage.getItem("userId"));

    try {
      const data = await getPostsByUserId(userId);

      setPosts(data);
    } catch {
      setError("Could not load your reviews.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!isLoggedIn()) {
      router.replace("/login");
      return;
    }

    loadPosts();
  }, [router]);

  async function handleDelete(id: number) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this review?",
    );

    if (!confirmed) return;

    try {
      await deletePost(id);

      setPosts((previous) => previous.filter((post) => post.id !== id));
    } catch {
      setError("Could not delete the review.");
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-base-200">
      <Navbar />

      <main className="mx-auto w-full max-w-7xl flex-grow px-6 py-12">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="font-semibold text-primary">Your contributions</p>

            <h1 className="mt-2 font-[family-name:var(--font-heading)] text-4xl font-bold text-neutral">
              My Reviews
            </h1>

            <p className="mt-2 text-secondary">
              Manage the reviews you have shared.
            </p>
          </div>

          <Link href="/posts/create" className="btn btn-primary">
            Write New Review
          </Link>
        </div>

        {error && (
          <div className="mt-8 rounded-lg bg-error/10 px-4 py-3 text-error">
            {error}
          </div>
        )}

        {loading && (
          <div className="mt-16 flex justify-center">
            <span className="loading loading-spinner loading-lg text-primary" />
          </div>
        )}

        {!loading && !error && posts.length === 0 && (
          <div className="mt-12 rounded-2xl border border-base-300 bg-base-100 p-12 text-center">
            <h2 className="text-2xl font-bold text-neutral">
              You haven't written any reviews yet.
            </h2>

            <p className="mt-2 text-secondary">
              Share your first experience with the community.
            </p>

            <Link href="/posts/create" className="btn btn-primary mt-6">
              Write Your First Review
            </Link>
          </div>
        )}

        {!loading && posts.length > 0 && (
          <div className="mt-10 grid gap-8 lg:grid-cols-2">
            {posts.map((post) => (
              <div key={post.id}>
                <PostCard post={post} />

                <div className="mt-3 flex gap-2">
                  <Link
                    href={`/posts/${post.id}`}
                    className="btn btn-sm btn-outline"
                  >
                    View
                  </Link>

                  <Link
                    href={`/posts/edit/${post.id}`}
                    className="btn btn-sm btn-primary"
                  >
                    Edit
                  </Link>

                  <button
                    onClick={() => handleDelete(post.id)}
                    className="btn btn-sm btn-error"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
