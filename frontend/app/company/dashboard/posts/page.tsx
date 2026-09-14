'use client';

import { useEffect, useState } from 'react';

import type { Post as PostType } from '@/types';

import { Post } from '@/components/ui/Post';

import { api } from '@/lib/api';
import { getRole, getUserId } from '@/lib/auth';

export default function CustomerReviewsPage() {
    const [posts, setPosts] = useState<PostType[]>([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        async function loadPosts() {
            try {
                const role = getRole();
                const companyId = getUserId();

                if (role !== 'COMPANY') {
                    setError(
                        'You are not authorized to access this page.',
                    );
                    return;
                }

                if (!companyId) {
                    setError(
                        'Company information not found.',
                    );
                    return;
                }

                const response = await api.get(
                    `/posts/company/${companyId}`,
                );

                setPosts(response.data);
            } catch (error: any) {
                console.error(error);

                const message =
                    error?.response?.data?.message;

                if (Array.isArray(message)) {
                    setError(message[0]);
                } else {
                    setError(
                        message ||
                        'Failed to load customer reviews.',
                    );
                }
            } finally {
                setLoading(false);
            }
        }

        loadPosts();
    }, []);

    // Loading
    if (loading) {
        return (
            <div>
                <h2 className="text-3xl font-bold">
                    Customer Reviews
                </h2>

                <p className="mt-4 text-gray-500">
                    Loading reviews...
                </p>
            </div>
        );
    }

    return (
        <div>
            {/* Page heading */}
            <div className="mb-8">
                <h2 className="text-3xl font-bold">
                    Customer Reviews
                </h2>

                <p className="mt-2 text-gray-500">
                    See what customers are saying about your
                    products.
                </p>
            </div>

            {/* Error */}
            {error && (
                <div className="mb-6 rounded-lg bg-red-50 p-4">
                    <p className="text-red-600">
                        {error}
                    </p>
                </div>
            )}

            {/* No posts */}
            {posts.length === 0 && !error ? (
                <div className="rounded-xl bg-white p-10 text-center shadow-sm">
                    <h3 className="text-xl font-semibold">
                        No Customer Reviews
                    </h3>

                    <p className="mt-2 text-gray-500">
                        Customers have not posted any reviews
                        for your products yet.
                    </p>
                </div>
            ) : (
                /* Posts */
                <div className="mx-auto w-full max-w-2xl space-y-6">
                    {posts.map((post) => (
                        <Post
                            key={post.id}
                            post={post}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}