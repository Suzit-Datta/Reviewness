"use client";

import { useEffect, useState } from "react";
import { getUsers, AppUser } from "@/lib/api";

export default function UsersPage() {
  const [users, setUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUsers().then((data) => {
      setUsers(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <p className="text-secondary">Loading users…</p>;

  return (
    <>
      <h1 className="text-2xl font-bold text-navy mb-6">Users</h1>
      {users.length === 0 ? (
        <p className="text-secondary text-sm">No users found.</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {users.map((user) => (
            <div
              key={user.id}
              className="bg-white border border-slate-200 rounded-lg p-4 flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-medium">
                {user.userName[0]?.toUpperCase()}
              </div>
              <div>
                <p className="font-medium text-navy">{user.userName}</p>
                <p className="text-sm text-secondary">{user.email}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}