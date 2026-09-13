'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { FormField } from '@/components/ui/FormField';
import { adminRegisterSchema } from '@/lib/validation';
import { registerAdmin } from '@/services/authService';

export default function AdminRegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    gender: 'Male',
    phone: '',
  });
  const [image, setImage] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});
    setServerError('');

    const result = adminRegisterSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        fieldErrors[issue.path[0] as string] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    const fd = new FormData();
    fd.append('name', form.name);
    fd.append('email', form.email);
    fd.append('password', form.password);
    fd.append('gender', form.gender);
    fd.append('phone', form.phone);
    if (image) fd.append('image', image);

    setLoading(true);
    try {
      await registerAdmin(fd);
      setSuccess(true);
      setTimeout(() => router.push('/login'), 1500);
    } catch (err: any) {
      setServerError(
        err?.response?.data?.message ?? 'Registration failed. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-base-200">
      <Navbar />
      <main className="mx-auto w-full max-w-lg flex-grow px-6 py-16">
        <div className="rounded-2xl border border-base-300 bg-base-100 p-8">
          <h1 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-neutral">
            Sign up as an Admin
          </h1>
          <p className="mt-2 text-secondary">Manage the Reviewness platform.</p>

          {success ? (
            <div className="mt-6 rounded-lg bg-success/10 px-4 py-3 text-success">
              Account created! Redirecting to login…
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <FormField label="Name" error={errors.name}>
                <input
                  className="input input-bordered w-full"
                  value={form.name}
                  onChange={(e) => update('name', e.target.value)}
                />
              </FormField>

              <FormField label="Email address" error={errors.email}>
                <input
                  type="email"
                  className="input input-bordered w-full"
                  value={form.email}
                  onChange={(e) => update('email', e.target.value)}
                />
              </FormField>

              <FormField label="Password" error={errors.password}>
                <input
                  type="password"
                  className="input input-bordered w-full"
                  value={form.password}
                  onChange={(e) => update('password', e.target.value)}
                />
              </FormField>

              <FormField label="Gender" error={errors.gender}>
                <select
                  className="select select-bordered w-full"
                  value={form.gender}
                  onChange={(e) => update('gender', e.target.value)}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </FormField>

              <FormField label="Phone" error={errors.phone}>
                <input
                  className="input input-bordered w-full"
                  value={form.phone}
                  onChange={(e) => update('phone', e.target.value)}
                />
              </FormField>

              <FormField label="Profile image (optional)">
                <input
                  type="file"
                  accept="image/png, image/jpeg"
                  className="file-input file-input-bordered w-full"
                  onChange={(e) => setImage(e.target.files?.[0] ?? null)}
                />
              </FormField>

              {serverError && (
                <div className="rounded-lg bg-error/10 px-4 py-2 text-sm text-error">
                  {serverError}
                </div>
              )}

              <button type="submit" disabled={loading} className="btn btn-primary btn-lg w-full">
                {loading ? 'Creating account…' : 'Sign up'}
              </button>

              <p className="text-center text-sm text-secondary">
                Already have an account?{' '}
                <Link href="/login" className="font-medium text-primary hover:underline">
                  Log in
                </Link>
              </p>
            </form>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}