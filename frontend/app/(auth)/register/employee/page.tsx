'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { FormField } from '@/components/ui/FormField';
import { employeeRegisterSchema } from '@/lib/validation';
import { registerEmployee } from '@/services/authService';

export default function EmployeeRegisterPage() {
  const [form, setForm] = useState({
    userName: '',
    email: '',
    password: '',
  });
  const [photo, setPhoto] = useState<File | null>(null);
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

    const result = employeeRegisterSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        fieldErrors[issue.path[0] as string] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    const fd = new FormData();
    fd.append('userName', form.userName);
    fd.append('email', form.email);
    fd.append('password', form.password);
    if (photo) fd.append('photo', photo);

    setLoading(true);
    try {
      await registerEmployee(fd);
      setSuccess(true);
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
            Sign up as an Employee
          </h1>
          <p className="mt-2 text-secondary">
            Join the moderation team. Your account needs admin approval before you can log in.
          </p>

          {success ? (
            <div className="mt-6 rounded-lg bg-warning/15 px-4 py-3 text-neutral">
              Account created! An admin must approve your account before you can log in.
              You&apos;ll be able to sign in once approved.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <FormField label="Username" error={errors.userName}>
                <input
                  className="input input-bordered w-full"
                  value={form.userName}
                  onChange={(e) => update('userName', e.target.value)}
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

              <FormField label="Profile photo (optional)">
                <input
                  type="file"
                  accept="image/png, image/jpeg"
                  className="file-input file-input-bordered w-full"
                  onChange={(e) => setPhoto(e.target.files?.[0] ?? null)}
                />
              </FormField>

              {serverError && (
                <div className="rounded-lg bg-error/10 px-4 py-2 text-sm text-error">
                  {serverError}
                </div>
              )}

              <button type="submit" disabled={loading} className="btn btn-primary btn-lg w-full">
                {loading ? 'Submitting…' : 'Sign up'}
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