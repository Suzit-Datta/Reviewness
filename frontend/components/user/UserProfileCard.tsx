"use client";

import Link from "next/link";
import { getUploadUrl } from "@/lib/constants";

type User = {
  id: number;
  userName: string;
  email: string;
  gender: string;
  image?: string;
  createdAt?: string;
};

export function UserProfileCard({ user }: { user: User }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-base-300 bg-base-100 shadow-sm">
      <div className="h-32 bg-neutral" />

      <div className="px-6 pb-6">
        <div className="-mt-12 mb-5">
          {user.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={getUploadUrl(user.image) ?? undefined}
              alt={user.userName}
              className="h-24 w-24 rounded-full border-4 border-base-100 object-cover"
            />
          ) : (
            <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-base-100 bg-primary text-3xl font-bold text-primary-content">
              {user.userName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-neutral">
          {user.userName}
        </h2>

        <p className="mt-1 text-secondary">{user.email}</p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl bg-base-200 p-4">
            <p className="text-sm text-secondary">Gender</p>
            <p className="mt-1 font-semibold capitalize text-neutral">
              {user.gender}
            </p>
          </div>

          <div className="rounded-xl bg-base-200 p-4">
            <p className="text-sm text-secondary">Member since</p>
            <p className="mt-1 font-semibold text-neutral">
              {user.createdAt
                ? new Date(user.createdAt).toLocaleDateString()
                : "Recently"}
            </p>
          </div>
        </div>

        <Link href="/user/profile/edit" className="btn btn-primary mt-6 w-full">
          Edit Profile
        </Link>
      </div>
    </div>
  );
}
