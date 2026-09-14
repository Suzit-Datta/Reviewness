"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { getUserById } from "@/services/userService";
import { getPostsByUserId } from "@/services/postService";
import { isLoggedIn } from "@/lib/auth";

export default function UserDashboardPage() {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [postCount, setPostCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn()) {
      router.replace("/login");
      return;
    }

    const userId = Number(localStorage.getItem("userId"));

    async function loadDashboard() {
      try {
        const [userData, posts] = await Promise.all([
          getUserById(userId),
          getPostsByUserId(userId),
        ]);

        setUser(userData);
        setPostCount(posts.length);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, [router]);

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

      <main className="mx-auto w-full max-w-7xl flex-grow px-6 py-12">
        <div>
          <p className="font-semibold text-primary">Welcome back</p>

          <h1 className="mt-2 font-[family-name:var(--font-heading)] text-4xl font-bold text-neutral">
            {user?.userName}
          </h1>

          <p className="mt-2 text-secondary">
            Share your experiences and help others make better choices.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-base-300 bg-base-100 p-6">
            <p className="text-secondary">My Reviews</p>
            <p className="mt-2 text-4xl font-bold text-neutral">{postCount}</p>
          </div>

          <Link
            href="/posts/create"
            className="rounded-2xl bg-primary p-6 text-primary-content transition hover:opacity-90"
          >
            <p className="text-sm opacity-80">Create</p>
            <h2 className="mt-2 text-2xl font-bold">Write a Review</h2>
          </Link>

          <Link
            href="/posts/my-posts"
            className="rounded-2xl border border-base-300 bg-base-100 p-6 transition hover:border-primary"
          >
            <p className="text-secondary">Manage</p>
            <h2 className="mt-2 text-2xl font-bold text-neutral">My Reviews</h2>
          </Link>
        </div>

        <div className="mt-8">
          <Link href="/feed" className="btn btn-outline btn-primary">
            Explore Review Feed
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
