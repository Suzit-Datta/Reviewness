"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { UserProfileCard } from "@/components/user/UserProfileCard";
import { getUserById } from "@/services/userService";
import { isLoggedIn } from "@/lib/auth";

export default function ProfilePage() {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn()) {
      router.replace("/login");
      return;
    }

    const userId = Number(localStorage.getItem("userId"));

    getUserById(userId)
      .then(setUser)
      .finally(() => setLoading(false));
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

      <main className="mx-auto w-full max-w-3xl flex-grow px-6 py-12">
        <h1 className="font-[family-name:var(--font-heading)] text-4xl font-bold text-neutral">
          My Profile
        </h1>

        <p className="mt-2 text-secondary">
          View and manage your Reviewness account.
        </p>

        <div className="mt-8">{user && <UserProfileCard user={user} />}</div>
      </main>

      <Footer />
    </div>
  );
}
