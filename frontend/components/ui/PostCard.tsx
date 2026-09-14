"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Post } from "@/types";
import { Stars } from "./Stars";
import { getUserById } from "@/services/userService";
import { getProductById } from "@/services/productService";
import { getUploadUrl } from "@/lib/constants";

// caches so the same id isn't fetched again by other cards
const userCache = new Map<number, string>();
const productCache = new Map<number, string>();

export function PostCard({ post }: { post: Post }) {
  const [userName, setUserName] = useState(userCache.get(post.userId) ?? "");
  const [productName, setProductName] = useState(
    productCache.get(post.productId) ?? "",
  );

  useEffect(() => {
    if (!userCache.has(post.userId)) {
      getUserById(post.userId)
        .then((u) => {
          const name = u?.userName ?? "Anonymous";
          userCache.set(post.userId, name);
          setUserName(name);
        })
        .catch(() => setUserName("Anonymous"));
    }

    if (!productCache.has(post.productId)) {
      getProductById(post.productId)
        .then((p) => {
          const name = p?.name ?? `Product #${post.productId}`;
          productCache.set(post.productId, name);
          setProductName(name);
        })
        .catch(() => setProductName(`Product #${post.productId}`));
    }
  }, [post.userId, post.productId]);

  const date = new Date(post.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Link
      href={`/feed/${post.id}`}
      className="flex flex-col overflow-hidden rounded-2xl border border-base-300 bg-base-100 transition-shadow hover:shadow-md"
    >
      <article className="flex flex-1 flex-col">
        {post.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={getUploadUrl(post.image) ?? undefined}
            alt={productName || "Product"}
            className="w-full h-auto max-h-[500px] object-contain bg-base-200"
          />
        )}
        <div className="flex flex-1 flex-col p-6">
          <h3 className="font-[family-name:var(--font-heading)] text-lg font-bold text-neutral">
            {productName || `Product #${post.productId}`}
          </h3>

          <div className="mt-2">
            <Stars rating={post.rating} />
          </div>

          <p className="mt-4 flex-grow leading-relaxed text-secondary">
            {post.caption}
          </p>

          <div className="mt-6 flex items-center gap-2 border-t border-base-300 pt-4 text-sm">
            <span className="font-semibold text-neutral">
              {userName || "Loading…"}
            </span>
            <span className="text-base-300">•</span>
            <span className="text-secondary">{date}</span>
          </div>
        </div>
      </article>
    </Link>
  );
}