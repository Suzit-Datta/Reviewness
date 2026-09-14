"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Stars } from "@/components/ui/Stars";
import { getPostById } from "@/services/postService";
import { getUserById } from "@/services/userService";
import { getProductById } from "@/services/productService";
import { getCommentsByPost, createComment } from "@/services/commentService";
import { getUploadUrl } from "@/lib/constants";
import { isLoggedIn } from "@/lib/auth";

type Comment = {
  id: number;
  content: string;
  userId?: number;
  postId: number;
  companyId?: number;
  createdAt: string;
};

// cache so the same commenter isn't re-fetched for every comment
const userCache = new Map<number, string>();

export default function FeedPostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const postId = Number(params.id);

  const [post, setPost] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [comments, setComments] = useState<Comment[]>([]);
  const [commenterNames, setCommenterNames] = useState<Record<number, string>>(
    {},
  );
  const [commentsLoading, setCommentsLoading] = useState(true);

  const [newComment, setNewComment] = useState("");
  const [posting, setPosting] = useState(false);
  const [commentError, setCommentError] = useState("");

  const loadComments = useCallback(async () => {
    setCommentsLoading(true);
    try {
      const data: Comment[] = await getCommentsByPost(postId);
      setComments(data);

      // resolve commenter usernames, using the cache where possible
      const uniqueUserIds = Array.from(
        new Set(data.map((c) => c.userId).filter((id): id is number => !!id)),
      );

      const namesToFetch = uniqueUserIds.filter((id) => !userCache.has(id));

      if (namesToFetch.length > 0) {
        const fetched = await Promise.all(
          namesToFetch.map((id) =>
            getUserById(id)
              .then((u) => {
                const name = u?.userName ?? "Anonymous";
                userCache.set(id, name);
                return [id, name] as const;
              })
              .catch(() => {
                userCache.set(id, "Anonymous");
                return [id, "Anonymous"] as const;
              }),
          ),
        );
        fetched.forEach(([id, name]) => userCache.set(id, name));
      }

      const nameMap: Record<number, string> = {};
      uniqueUserIds.forEach((id) => {
        nameMap[id] = userCache.get(id) ?? "Anonymous";
      });
      setCommenterNames(nameMap);
    } catch {
      // fail quietly — comments section will just show none
    } finally {
      setCommentsLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    async function loadPost() {
      try {
        const postData = await getPostById(postId);
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
    loadComments();
  }, [postId, loadComments]);

  async function handleAddComment(e: React.FormEvent) {
    e.preventDefault();
    setCommentError("");

    if (!isLoggedIn()) {
      setCommentError("Please log in to comment.");
      router.push("/login");
      return;
    }

    if (!newComment.trim()) {
      setCommentError("Please write a comment before submitting.");
      return;
    }

    const userId = Number(localStorage.getItem("userId"));

    setPosting(true);
    try {
      await createComment(newComment.trim(), postId, userId);
      setNewComment("");
      await loadComments();
    } catch (err: any) {
      const message =
        err?.response?.data?.message ?? "Could not post your comment.";
      setCommentError(Array.isArray(message) ? message.join(", ") : message);
    } finally {
      setPosting(false);
    }
  }

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

        {/* Comment box */}
        <div className="mt-8 rounded-2xl border border-base-300 bg-base-100 p-6">
          <h2 className="font-[family-name:var(--font-heading)] text-xl font-bold text-neutral">
            Comments
          </h2>

          <form onSubmit={handleAddComment} className="mt-4">
            <textarea
              className="textarea textarea-bordered min-h-24 w-full"
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />

            {commentError && (
              <p className="mt-2 text-sm text-error">{commentError}</p>
            )}

            <div className="mt-3 flex justify-end">
              <button
                type="submit"
                disabled={posting}
                className="btn btn-primary"
              >
                {posting ? "Posting..." : "Add Comment"}
              </button>
            </div>
          </form>

          {/* Comment list */}
          <div className="mt-6 space-y-4 border-t border-base-300 pt-6">
            {commentsLoading && (
              <div className="flex justify-center py-6">
                <span className="loading loading-spinner text-primary" />
              </div>
            )}

            {!commentsLoading && comments.length === 0 && (
              <p className="text-center text-sm text-secondary">
                No comments yet. Be the first to comment!
              </p>
            )}

            {!commentsLoading &&
              comments.map((comment) => (
                <div key={comment.id} className="rounded-xl bg-base-200 p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-neutral">
                      {comment.userId
                        ? (commenterNames[comment.userId] ?? "Loading…")
                        : "Anonymous"}
                    </span>
                    <span className="text-xs text-secondary">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="mt-2 text-secondary">{comment.content}</p>
                </div>
              ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
