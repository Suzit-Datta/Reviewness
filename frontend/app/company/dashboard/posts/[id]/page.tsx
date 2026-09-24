"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { api } from "../../../../../lib/api";
import { getRole, getUserId } from "../../../../../lib/auth";

type Post = {
    id: number;
    caption: string;
    rating: number;
    image?: string;
    userId: number;
    companyId: number;
    categoryId: number;
    productId: number;
    createdAt: string;
    updatedAt: string;
};

type User = {
    id: number;
    userName: string;
};

type Company = {
    id: number;
    companyName: string;
};

type Product = {
    id: number;
    name: string;
};

type Comment = {
    id: number;
    content: string;
    userId?: number | null;
    postId: number;
    companyId?: number | null;
    createdAt: string;
    updatedAt: string;
};

export default function ReviewDetailsPage() {
    const params = useParams();
    const router = useRouter();

    const postId = Number(params.id);

    const [post, setPost] = useState<Post | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [product, setProduct] = useState<Product | null>(null);

    const [comments, setComments] = useState<Comment[]>([]);
    const [commentNames, setCommentNames] = useState<
        Record<number, string>
    >({});

    const [commentText, setCommentText] = useState("");

    const [loading, setLoading] = useState(true);
    const [commentLoading, setCommentLoading] = useState(false);

    const [error, setError] = useState("");
    const [commentError, setCommentError] = useState("");

    useEffect(() => {
        async function loadPost() {
            try {
                const role = getRole();

                if (role !== "COMPANY") {
                    setError(
                        "You are not authorized to access this page.",
                    );
                    return;
                }

                if (!postId) {
                    setError("Invalid review ID.");
                    return;
                }

                // =========================
                // GET POST
                // =========================

                const postResponse = await api.get(
                    `/posts/${postId}`,
                );

                const postData: Post = postResponse.data;

                setPost(postData);

                // =========================
                // GET PRODUCT
                // =========================

                const productResponse = await api.get(
                    `/products/${postData.productId}`,
                );

                setProduct(productResponse.data);

                // =========================
                // GET CUSTOMER
                // =========================

                const userResponse = await api.get(
                    `/users/${postData.userId}`,
                );

                setUser(userResponse.data);

                // =========================
                // GET COMMENTS
                // =========================

                const commentsResponse = await api.get(
                    `/comment/post/${postId}`,
                );

                const commentsData: Comment[] =
                    commentsResponse.data;

                setComments(commentsData);

                // =========================
                // GET COMMENTER NAMES
                // =========================

                const names: Record<number, string> = {};

                await Promise.all(
                    commentsData.map(async (comment) => {
                        // -------------------------
                        // COMMENT BY COMPANY
                        // -------------------------

                        if (comment.companyId) {
                            try {
                                const companyResponse =
                                    await api.get(
                                        `/companies/${comment.companyId}`,
                                    );

                                const company: Company =
                                    companyResponse.data;

                                names[comment.id] =
                                    company.companyName;
                            } catch (error) {
                                console.error(
                                    "Failed to load company:",
                                    error,
                                );

                                names[comment.id] = "Company";
                            }

                            return;
                        }

                        // -------------------------
                        // COMMENT BY USER
                        // -------------------------

                        if (comment.userId) {
                            try {
                                const userResponse =
                                    await api.get(
                                        `/users/${comment.userId}`,
                                    );

                                const commentUser: User =
                                    userResponse.data;

                                names[comment.id] =
                                    commentUser.userName;
                            } catch (error) {
                                console.error(
                                    "Failed to load user:",
                                    error,
                                );

                                names[comment.id] = "User";
                            }

                            return;
                        }

                        // -------------------------
                        // NO USER OR COMPANY
                        // -------------------------

                        names[comment.id] = "Unknown";
                    }),
                );

                setCommentNames(names);
            } catch (error: any) {
                console.error(error);

                const message =
                    error?.response?.data?.message;

                if (Array.isArray(message)) {
                    setError(message[0]);
                } else {
                    setError(
                        message || "Failed to load review.",
                    );
                }
            } finally {
                setLoading(false);
            }
        }

        loadPost();
    }, [postId]);

    // =========================
    // ADD COMMENT
    // =========================

    async function handleAddComment() {
        setCommentError("");

        const companyId = getUserId();

        if (!companyId) {
            setCommentError(
                "Company information not found.",
            );
            return;
        }

        if (!commentText.trim()) {
            setCommentError(
                "Comment cannot be empty.",
            );
            return;
        }

        try {
            setCommentLoading(true);

            const response = await api.post("/comment", {
                content: commentText.trim(),

                // Logged-in company ID
                companyId: Number(companyId),

                // Current post ID
                postId: Number(postId),
            });

            const newComment: Comment =
                response.data;

            // Add new comment immediately
            setComments((previousComments) => [
                ...previousComments,
                newComment,
            ]);

            // Get company name for the new comment
            const companyResponse = await api.get(
                `/companies/${companyId}`,
            );

            const company: Company =
                companyResponse.data;

            setCommentNames((previousNames) => ({
                ...previousNames,
                [newComment.id]:
                    company.companyName,
            }));

            // Clear textarea
            setCommentText("");
        } catch (error: any) {
            console.error(error);

            const message =
                error?.response?.data?.message;

            if (Array.isArray(message)) {
                setCommentError(message[0]);
            } else {
                setCommentError(
                    message || "Failed to add comment.",
                );
            }
        } finally {
            setCommentLoading(false);
        }
    }

    // =========================
    // LOADING
    // =========================

    if (loading) {
        return (
            <div>
                <h2 className="text-3xl font-bold">
                    Review Details
                </h2>

                <p className="mt-4 text-gray-500">
                    Loading review...
                </p>
            </div>
        );
    }

    // =========================
    // ERROR
    // =========================

    if (error) {
        return (
            <div>
                <h2 className="text-3xl font-bold">
                    Review Details
                </h2>

                <div className="mt-6 rounded-lg bg-red-50 p-4">
                    <p className="text-red-600">
                        {error}
                    </p>
                </div>
            </div>
        );
    }

    // =========================
    // REVIEW NOT FOUND
    // =========================

    if (!post) {
        return (
            <div>
                <h2 className="text-3xl font-bold">
                    Review Not Found
                </h2>

                <p className="mt-4 text-gray-500">
                    This review does not exist.
                </p>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-3xl">

            {/* =========================
          BACK BUTTON
      ========================= */}

            <button
                onClick={() =>
                    router.push(
                        "/company/dashboard/posts",
                    )
                }
                className="mb-6 rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium hover:bg-gray-300"
            >
                ← Back to Reviews
            </button>

            {/* =========================
          REVIEW CARD
      ========================= */}

            <div className="overflow-hidden rounded-xl border bg-white shadow-sm">

                {/* Customer Information */}
                <div className="flex items-center gap-3 border-b p-6">

                    {/* Customer Avatar */}
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200 text-lg font-semibold">
                        {user?.userName
                            ?.charAt(0)
                            .toUpperCase() || "U"}
                    </div>

                    {/* Customer Name */}
                    <div>
                        <h3 className="font-semibold">
                            {user?.userName || "Customer"}
                        </h3>

                        <p className="text-sm text-gray-500">
                            {new Date(
                                post.createdAt,
                            ).toLocaleDateString()}
                        </p>
                    </div>

                </div>

                {/* Review Image */}
                {post.image && (
                    <img
                        src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${post.image}`}
                        alt="Customer review"
                        className="max-h-[600px] w-full object-cover"
                    />
                )}

                {/* Review Content */}
                <div className="p-6">

                    {/* Product Name */}
                    <div className="mb-4">
                        <p className="text-xl font-bold text-gray-900">
                            {product?.name || "Product"}
                        </p>
                    </div>

                    {/* Rating */}
                    <div className="mb-6">
                        <span className="text-lg font-semibold">
                            ⭐ {post.rating}/5
                        </span>
                    </div>

                    {/* Customer Review */}
                    <h3 className="mb-3 text-lg font-semibold">
                        Customer Review
                    </h3>

                    <p className="leading-8 text-gray-700">
                        {post.caption}
                    </p>

                </div>

            </div>

            {/* =========================
          COMMENT BOX
      ========================= */}

            <div className="mt-6 rounded-xl border bg-white p-6 shadow-sm">

                <h3 className="mb-4 text-lg font-semibold">
                    Add a Comment
                </h3>

                <textarea
                    value={commentText}
                    onChange={(event) =>
                        setCommentText(event.target.value)
                    }
                    placeholder="Write your comment..."
                    rows={4}
                    className="w-full resize-none rounded-lg border p-3 outline-none focus:border-black"
                />

                {/* Comment Error */}
                {commentError && (
                    <p className="mt-2 text-sm text-red-600">
                        {commentError}
                    </p>
                )}

                {/* Post Comment Button */}
                <div className="mt-4 flex justify-end">

                    <button
                        onClick={handleAddComment}
                        disabled={commentLoading}
                        className="rounded-lg bg-black px-6 py-2 text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {commentLoading
                            ? "Posting..."
                            : "Post Comment"}
                    </button>

                </div>

            </div>

            {/* =========================
          COMMENTS
      ========================= */}

            <div className="mt-6">

                <h3 className="mb-4 text-xl font-semibold">
                    Comments ({comments.length})
                </h3>

                {comments.length === 0 ? (

                    <div className="rounded-xl border bg-white p-6 text-center">
                        <p className="text-gray-500">
                            No comments yet.
                        </p>
                    </div>

                ) : (

                    <div className="space-y-4">

                        {comments.map((comment) => {
                            const commenterName =
                                commentNames[comment.id] ||
                                "Loading...";

                            return (
                                <div
                                    key={comment.id}
                                    className="rounded-xl border bg-white p-5 shadow-sm"
                                >

                                    <div className="flex items-start gap-3">

                                        {/* Comment Avatar */}
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 font-semibold">
                                            {commenterName
                                                .charAt(0)
                                                .toUpperCase()}
                                        </div>

                                        <div className="flex-1">

                                            {/* Comment Header */}
                                            <div className="flex items-center justify-between">

                                                <p className="font-semibold">
                                                    {commenterName}
                                                </p>

                                                <p className="text-xs text-gray-500">
                                                    {new Date(
                                                        comment.createdAt,
                                                    ).toLocaleDateString()}
                                                </p>

                                            </div>

                                            {/* Comment Content */}
                                            <p className="mt-2 leading-6 text-gray-700">
                                                {comment.content}
                                            </p>

                                        </div>

                                    </div>

                                </div>
                            );
                        })}

                    </div>

                )}

            </div>

        </div>
    );
}