'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { loginSchema } from '@/lib/validation';
import { login } from '@/services/authService';
import { saveAuth } from '@/lib/auth';

const roleRoutes: Record<string, string> = {
  ADMIN: '/admin/dashboard',
  USER: '/user/dashboard',
  COMPANY: '/company/dashboard',
  EMPLOYEE: '/employee/dashboard',
};

export function LoginForm() {
  const router = useRouter();
  const [role, setRole] = useState('USER');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    // 1. Validate with Zod
    const result = loginSchema.safeParse({ role, email, password });
    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }

    // 2. Call the backend
    setLoading(true);
    try {
      const data = await login({ role, email, password });
      saveAuth(data);
      // 3. Redirect based on role
      router.push(roleRoutes[data.role] ?? '/');
    } catch (err: any) {
      setError(
        err?.response?.data?.message ?? 'Login failed. Check your credentials.',
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-base-300 bg-base-100 p-8 shadow-sm">
      <h3 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-neutral">
        Welcome back
      </h3>
      <p className="mt-2 text-secondary">
        Log in to write reviews and keep track of your contributions.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div>
          <label className="mb-1.5 block font-semibold text-neutral">Role</label>
          <select
            className="select select-bordered w-full"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="USER">User</option>
            <option value="COMPANY">Company</option>
            <option value="EMPLOYEE">Employee</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>

        <div>
          <label className="mb-1.5 block font-semibold text-neutral">Email address</label>
          <input
            type="email"
            placeholder="you@example.com"
            className="input input-bordered w-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label className="font-semibold text-neutral">Password</label>
            <Link href="#" className="text-sm font-medium text-primary hover:underline">
              Forgot password?
            </Link>
          </div>
          <input
            type="password"
            placeholder="Enter your password"
            className="input input-bordered w-full"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error && (
          <div className="rounded-lg bg-error/10 px-4 py-2 text-sm text-error">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary btn-lg w-full"
        >
          {loading ? 'Logging in…' : 'Log in'}
        </button>
      </form>
    </div>
  );
}