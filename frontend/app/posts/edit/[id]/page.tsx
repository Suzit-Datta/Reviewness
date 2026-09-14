"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PostForm } from "@/components/ui/PostForm";
import { getPostById } from "@/services/postService";

export default function EditPostPage() {
  const params = useParams();
  const router = useRouter();

  const [post, setPost] = useState<any>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    const id = Number(params.id);

    if (!id) {
      setError("Invalid post ID.");
      setLoading(false);
      return;
    }

    getPostById(id)
      .then((data) => {
        const currentUserId = Number(localStorage.getItem("userId"));

        if (data.userId !== currentUserId) {
          setError("You can only edit your own reviews.");
          return;
        }

        setPost(data);
      })
      .catch(() => {
        setError("Review not found.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-base-200">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-base-200">
      <Navbar />

      <main className="mx-auto w-full max-w-2xl flex-grow px-6 py-12">
        <h1 className="font-[family-name:var(--font-heading)] text-4xl font-bold text-neutral">
          Edit Review
        </h1>

        {error && (
          <div className="mt-6 rounded-lg bg-error/10 px-4 py-3 text-error">
            {error}
          </div>
        )}

        {post && (
          <div className="mt-8">
            <PostForm
              initialData={{
                id: post.id,
                caption: post.caption,
                rating: post.rating,
                companyId: post.companyId,
                categoryId: post.categoryId,
                productId: post.productId,
              }}
              onSuccess={() => router.push("/posts/my-posts")}
            />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
