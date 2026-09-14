'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Pusher from 'pusher-js';
import { getRole, isLoggedIn, clearAuth } from '@/lib/auth';

const navItems = [
  { label: 'Overview', href: '/admin/dashboard' },
  { label: 'My Profile', href: '/admin/profile' },
  { label: 'Employees', href: '/admin/employees' },
  { label: 'Companies', href: '/admin/companies' },
  { label: 'Admins', href: '/admin/admins' },
  { label: 'Review Feed', href: '/feed' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // Auth + role guard
  useEffect(() => {
    if (!isLoggedIn()) {
      router.replace('/auth/login');
      return;
    }
    if (getRole() !== 'ADMIN') {
      router.replace('/');
      return;
    }
    setAuthorized(true);
  }, [router]);

  // Pusher real-time notifications (runs once admin is authorized)
  useEffect(() => {
    if (!authorized) return;

    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    });

    const channel = pusher.subscribe('admin-notifications');
    channel.bind('new-employee', (data: { message: string }) => {
      setToast(data.message);
      setTimeout(() => setToast(null), 6000);
    });

    return () => {
      pusher.unsubscribe('admin-notifications');
      pusher.disconnect();
    };
  }, [authorized]);

  function handleLogout() {
    clearAuth();
    router.push('/auth/login');
  }

  if (!authorized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-base-200">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-base-200">
      {/* Sidebar */}
      <aside className="flex w-64 flex-col bg-neutral text-neutral-content">
        <div className="border-b border-white/10 px-6 py-5">
          <Link
            href="/"
            className="font-[family-name:var(--font-heading)] text-2xl font-bold"
          >
            Reviewness<span className="text-accent">.</span>
          </Link>
          <p className="mt-1 text-sm text-neutral-content/60">Admin Panel</p>
        </div>

        <nav className="flex-1 px-3 py-4">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`mb-1 block rounded-lg px-4 py-2.5 font-medium transition ${
                  active
                    ? 'bg-primary text-primary-content'
                    : 'hover:bg-white/10'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-white/10 p-3">
          <button
            onClick={handleLogout}
            className="block w-full rounded-lg px-4 py-2.5 text-left font-medium hover:bg-white/10"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 overflow-auto">
        <div className="mx-auto max-w-6xl px-8 py-10">{children}</div>
      </main>

      {/* Real-time toast notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm rounded-xl border border-base-300 bg-base-100 p-4 shadow-lg">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
              🔔
            </div>
            <div>
              <p className="font-semibold text-neutral">New Employee</p>
              <p className="mt-1 text-sm text-secondary">{toast}</p>
            </div>
            <button
              onClick={() => setToast(null)}
              className="ml-auto text-secondary hover:text-neutral"
              aria-label="Dismiss"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}