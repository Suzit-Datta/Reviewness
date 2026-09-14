"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Stars } from "@/components/ui/Stars";
import { getPostById } from "@/services/postService";
import { getUserById } from "@/services/userService";
import { getProductById } from "@/services/productService";
import { getUploadUrl } from "@/lib/constants";

export default function PostDetailsPage() {
  const params = useParams();

  const [post, setPost] = useState<any>(null);

  const [user, setUser] = useState<any>(null);

  const [product, setProduct] = useState<any>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    const id = Number(params.id);

    async function loadPost() {
      try {
        const postData = await getPostById(id);

        setPost(postData);

        const [userData, productData] = await Promise.all([
          getUserById(postData.userId),
          getProductById(postData.productId),
        ]);

        setUser(userData);
        setProduct(productData);
      } catch {
        setError("This review could not be found.");
      } finally {
        setLoading(false);
      }
    }

    loadPost();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-base-200">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="flex min-h-screen flex-col bg-base-200">
        <Navbar />

        <main className="mx-auto flex w-full max-w-3xl flex-grow items-center justify-center px-6 py-16 text-center">
          <div>
            <h1 className="text-4xl font-bold text-neutral">
              Review not found
            </h1>

            <p className="mt-3 text-secondary">
              The review may have been deleted or does not exist.
            </p>

            <Link href="/feed" className="btn btn-primary mt-6">
              Back to Feed
            </Link>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-base-200">
      <Navbar />

      <main className="mx-auto w-full max-w-3xl flex-grow px-6 py-12">
        <Link href="/feed" className="font-medium text-primary hover:underline">
          ← Back to Feed
        </Link>

        <article className="mt-6 overflow-hidden rounded-2xl border border-base-300 bg-base-100">
          {post.image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={getUploadUrl(post.image) ?? undefined}
              alt={product?.name ?? "Review"}
              className="max-h-[600px] w-full bg-base-200 object-contain"
            />
          )}

          <div className="p-8">
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">
              {product?.name ?? `Product #${post.productId}`}
            </p>

            <div className="mt-3">
              <Stars rating={post.rating} />
            </div>

            <p className="mt-6 text-lg leading-relaxed text-secondary">
              {post.caption}
            </p>

            <div className="mt-8 border-t border-base-300 pt-6">
              <p className="text-sm text-secondary">Reviewed by</p>

              <p className="mt-1 font-bold text-neutral">
                {user?.userName ?? "Anonymous"}
              </p>

              <p className="mt-1 text-sm text-secondary">
                {new Date(post.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
