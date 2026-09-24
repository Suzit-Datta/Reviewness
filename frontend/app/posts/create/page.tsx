"use client";

import { useRouter } from "next/navigation";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PostForm } from "@/components/ui/PostForm";

export default function CreatePostPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col bg-base-200">
      <Navbar />

      <main className="mx-auto w-full max-w-2xl flex-grow px-6 py-12">
        <p className="font-semibold text-primary">Share your experience</p>

        <h1 className="mt-2 font-[family-name:var(--font-heading)] text-4xl font-bold text-neutral">
          Write a Review
        </h1>

        <p className="mt-2 text-secondary">
          Your honest review can help someone make a better decision.
        </p>

        <div className="mt-8">
          <PostForm onSuccess={() => router.push("/posts/my-posts")} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
