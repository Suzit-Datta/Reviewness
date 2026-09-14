"use client";

import { useEffect, useState } from "react";
import { getUsers, AppUser } from "@/lib/api";
import RequireStaff from "@/components/RequireStaff";

function UserListContent() {
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
      <div className="grid gap-3 sm:grid-cols-2">
        {users.map((u) => {
          const imageUrl = u.image
            ? `${process.env.NEXT_PUBLIC_API_URL}/uploads/${u.image}`
            : null;
          return (
            <div
              key={u.id}
              className="flex items-center gap-3 bg-white border border-slate-200 rounded-lg p-4"
            >
              <div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden flex items-center justify-center text-slate-400 shrink-0">
                {imageUrl ? (
                  <img src={imageUrl} alt={u.userName} className="w-full h-full object-cover" />
                ) : (
                  <span>{u.userName[0]?.toUpperCase()}</span>
                )}
              </div>
              <div>
                <p className="font-medium text-navy">{u.userName}</p>
                <p className="text-sm text-secondary">{u.email}</p>
              </div>
            </div>
          );
        })}
        {users.length === 0 && (
          <p className="text-secondary text-center py-10 col-span-2">No users yet.</p>
        )}
      </div>
    </>
  );
}

export default function UserListPage() {
  return (
    <div className="max-w-3xl mx-auto p-6 w-full">
      <RequireStaff>
        <UserListContent />
      </RequireStaff>
    </div>
  );
}