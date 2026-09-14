'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { clearAuth } from '@/lib/auth';

export function Navbar() {
  const router = useRouter();
  // null = not yet determined (during first render / SSR)
  const [role, setRole] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // runs only in the browser, where localStorage exists
    const token = localStorage.getItem('accessToken');
    const storedRole = localStorage.getItem('role');
    setRole(token ? storedRole : null);
    setReady(true);
  }, []);

  function handleLogout() {
    clearAuth();
    setRole(null);
    router.push('/login');
  }

  return (
    <nav className="bg-neutral text-neutral-content">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        {/* Logo */}
        <Link
          href="/"
          className="font-[family-name:var(--font-heading)] text-2xl font-bold"
        >
          Reviewness<span className="text-accent">.</span>
        </Link>

        {/* Right side — depends on auth state */}
        <div className="flex items-center gap-4">
          {/* While auth state is loading, render nothing to avoid a flash */}
          {ready && <NavLinks role={role} onLogout={handleLogout} />}
        </div>
      </div>
    </nav>
  );
}

function NavLinks({
  role,
  onLogout,
}: {
  role: string | null;
  onLogout: () => void;
}) {
  // LOGGED OUT
  if (!role) {
    return (
      <>
        <Link href="/login" className="font-medium hover:opacity-80">
          Log in
        </Link>
        <Link href="/register" className="btn btn-primary">
          Sign up
        </Link>
      </>
    );
  }

  // LOGGED IN — USER
  if (role === 'USER') {
    return (
      <>
        <Link href="/feed" className="font-medium hover:opacity-80">
          Feed
        </Link>
        <Link href="/user/profile" className="font-medium hover:opacity-80">
          Profile
        </Link>
        <button onClick={onLogout} className="btn btn-primary btn-sm">
          Logout
        </button>
      </>
    );
  }

  // LOGGED IN — ADMIN / COMPANY / EMPLOYEE (all: Dashboard + role name + Logout)
  const dashboardRoutes: Record<string, string> = {
    ADMIN: '/admin/dashboard',
    COMPANY: '/company/dashboard',
    EMPLOYEE: '/employee/dashboard',
  };

  return (
    <>
      <Link
        href={dashboardRoutes[role] ?? '/'}
        className="font-medium hover:opacity-80"
      >
        Dashboard
      </Link>
      <span className="inline-flex items-center rounded-full bg-yellow-600 px-3 py-1 text-xs font-semibold text-neutral-content">
       {role}</span>
      <button onClick={onLogout} className="btn btn-primary btn-sm">
        Logout
      </button>
    </>
  );
}