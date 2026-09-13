'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { FormField } from '@/components/ui/FormField';
import { companyRegisterSchema } from '@/lib/validation';
import { registerCompany } from '@/services/authService';

export default function CompanyRegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    companyName: '',
    email: '',
    password: '',
    industryId: '',
  });
  const [logo, setLogo] = useState<File | null>(null);
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

    const result = companyRegisterSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        fieldErrors[issue.path[0] as string] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    const fd = new FormData();
    fd.append('companyName', form.companyName);
    fd.append('email', form.email);
    fd.append('password', form.password);
    fd.append('industryId', form.industryId);
    if (logo) fd.append('logo', logo);

    setLoading(true);
    try {
      await registerCompany(fd);
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
            Sign up as a Company
          </h1>
          <p className="mt-2 text-secondary">Manage your products and respond to reviews.</p>

          {success ? (
            <div className="mt-6 rounded-lg bg-success/10 px-4 py-3 text-success">
              Account created! Redirecting to login…
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <FormField label="Company name" error={errors.companyName}>
                <input
                  className="input input-bordered w-full"
                  value={form.companyName}
                  onChange={(e) => update('companyName', e.target.value)}
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

              <FormField label="Industry ID" error={errors.industryId}>
                <input
                  className="input input-bordered w-full"
                  placeholder="e.g. 1"
                  value={form.industryId}
                  onChange={(e) => update('industryId', e.target.value)}
                />
              </FormField>

              <FormField label="Company logo (optional)">
                <input
                  type="file"
                  accept="image/png, image/jpeg"
                  className="file-input file-input-bordered w-full"
                  onChange={(e) => setLogo(e.target.files?.[0] ?? null)}
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