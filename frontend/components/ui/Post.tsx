'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import type { Post as PostType } from '@/types';

import { Stars } from './Stars';

import { getUserById } from '@/services/userService';
import { getProductById } from '@/services/productService';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const userCache = new Map<number, string>();
const productCache = new Map<number, string>();

export function Post({ post }: { post: PostType }) {
    const router = useRouter();

    const [userName, setUserName] = useState(
        userCache.get(post.userId) ?? '',
    );

    const [productName, setProductName] = useState(
        productCache.get(post.productId) ?? '',
    );

    useEffect(() => {
        if (!userCache.has(post.userId)) {
            getUserById(post.userId)
                .then((user) => {
                    const name = user?.userName ?? 'Anonymous';

                    userCache.set(post.userId, name);
                    setUserName(name);
                })
                .catch(() => {
                    setUserName('Anonymous');
                });
        }

        if (!productCache.has(post.productId)) {
            getProductById(post.productId)
                .then((product) => {
                    const name =
                        product?.name ??
                        `Product #${post.productId}`;

                    productCache.set(post.productId, name);
                    setProductName(name);
                })
                .catch(() => {
                    setProductName(
                        `Product #${post.productId}`,
                    );
                });
        }
    }, [post.userId, post.productId]);

    const date = new Date(
        post.createdAt,
    ).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    function handleClick() {
        router.push(
            `/company/dashboard/posts/${post.id}`,
        );
    }

    return (
        <article
            onClick={handleClick}
            className="flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-base-300 bg-base-100 transition hover:shadow-md"
        >
            {/* Customer information */}
            <div className="flex items-center gap-3 border-b border-base-300 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-base-200 text-lg font-bold">
                    {userName
                        ? userName.charAt(0).toUpperCase()
                        : 'U'}
                </div>

                <div>
                    <h3 className="font-semibold text-neutral">
                        {userName || 'Loading…'}
                    </h3>

                    <p className="text-sm text-secondary">
                        {date}
                    </p>
                </div>
            </div>

            {/* Post image */}
            {post.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                    src={`${API_URL}/uploads/${post.image}`}
                    alt={productName || 'Product'}
                    className="h-auto max-h-[500px] w-full object-contain bg-base-200"
                />
            )}

            {/* Post content */}
            <div className="flex flex-1 flex-col p-6">

                {/* Product name */}
                <h3 className="font-[family-name:var(--font-heading)] text-lg font-bold text-neutral">
                    {productName ||
                        `Product #${post.productId}`}
                </h3>

                {/* Rating */}
                <div className="mt-2">
                    <Stars rating={post.rating} />
                </div>

                {/* Caption */}
                <p className="mt-4 flex-grow leading-relaxed text-secondary">
                    {post.caption}
                </p>

            </div>
        </article>
    );
}