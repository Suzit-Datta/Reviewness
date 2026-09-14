'use client';

import { useEffect, useState } from 'react';
import { getUserId } from '@/lib/auth';
import { getAdminById, updateAdmin } from '@/services/adminService';
import { adminUpdateSchema } from '@/lib/validation';
import { FormField } from '@/components/ui/FormField';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type Admin = {
  id: number;
  name: string;
  email: string;
  gender: string;
  phone: string;
  image?: string;
  createdAt: string;
};

export default function AdminProfilePage() {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  // form state
  const [form, setForm] = useState({ name: '', email: '', gender: 'Male', phone: '' });
  const [image, setImage] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverMsg, setServerMsg] = useState('');
  const [saving, setSaving] = useState(false);

  const adminId = getUserId();

  useEffect(() => {
    if (!adminId) return;
    getAdminById(adminId)
      .then((data) => {
        setAdmin(data);
        setForm({
          name: data.name ?? '',
          email: data.email ?? '',
          gender: data.gender ?? 'Male',
          phone: data.phone ?? '',
        });
      })
      .finally(() => setLoading(false));
  }, [adminId]);

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});
    setServerMsg('');

    const result = adminUpdateSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((i) => {
        fieldErrors[i.path[0] as string] = i.message;
      });
      setErrors(fieldErrors);
      return;
    }

    const fd = new FormData();
    fd.append('name', form.name);
    fd.append('email', form.email);
    fd.append('gender', form.gender);
    fd.append('phone', form.phone);
    if (image) fd.append('image', image);

    setSaving(true);
    try {
      const updated = await updateAdmin(adminId!, fd);
      setAdmin(updated);
      setEditing(false);
      setImage(null);
      setServerMsg('Profile updated successfully.');
    } catch (err: any) {
      setServerMsg(err?.response?.data?.message ?? 'Update failed. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  if (!admin) {
    return <p className="text-error">Could not load your profile.</p>;
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold text-neutral">
          My Profile
        </h1>
        {!editing && (
          <button onClick={() => setEditing(true)} className="btn btn-primary">
            Edit Profile
          </button>
        )}
      </div>

      {serverMsg && (
        <div className="mt-4 rounded-lg bg-success/10 px-4 py-3 text-success">{serverMsg}</div>
      )}

      <div className="mt-8 rounded-2xl border border-base-300 bg-base-100 p-8">
        {/* Avatar */}
        <div className="flex items-center gap-6">
          <div className="h-24 w-24 overflow-hidden rounded-full bg-base-200">
            {admin.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={`${API_URL}/uploads/${admin.image}`}
                alt={admin.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center font-[family-name:var(--font-heading)] text-3xl font-bold text-secondary">
                {admin.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div>
            <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-neutral">
              {admin.name}
            </h2>
            <span className="mt-1 inline-flex items-center rounded-full bg-primary px-3 py-1 text-sm font-semibold text-primary-content">
  Administrator
</span>
          </div>
        </div>

        {/* VIEW MODE */}
        {!editing ? (
          <dl className="mt-8 grid gap-6 sm:grid-cols-2">
            <Field label="Email" value={admin.email} />
            <Field label="Phone" value={admin.phone} />
            <Field label="Gender" value={admin.gender} />
            <Field
              label="Member since"
              value={new Date(admin.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            />
          </dl>
        ) : (
          /* EDIT MODE */
          <form onSubmit={handleSave} className="mt-8 space-y-5">
            <FormField label="Name" error={errors.name}>
              <input
                className="input input-bordered w-full"
                value={form.name}
                onChange={(e) => update('name', e.target.value)}
              />
            </FormField>

            <FormField label="Email" error={errors.email}>
              <input
                type="email"
                className="input input-bordered w-full"
                value={form.email}
                onChange={(e) => update('email', e.target.value)}
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

            <FormField label="Change photo (optional)">
              <input
                type="file"
                accept="image/png, image/jpeg"
                className="file-input file-input-bordered w-full"
                onChange={(e) => setImage(e.target.files?.[0] ?? null)}
              />
            </FormField>

            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={saving} className="btn btn-primary">
                {saving ? 'Saving…' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditing(false);
                  setErrors({});
                }}
                className="btn btn-ghost"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-sm font-medium text-secondary">{label}</dt>
      <dd className="mt-1 font-medium text-neutral">{value}</dd>
    </div>
  );
}