'use client';

import { useEffect, useState } from 'react';
import { getAllAdmins, createAdmin, deleteAdmin } from '@/services/adminService';
import { adminRegisterSchema } from '@/lib/validation';
import { FormField } from '@/components/ui/FormField';
import { getUserId } from '@/lib/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type Admin = {
  id: number;
  name: string;
  email: string;
  phone: string;
  gender: string;
  image?: string;
};

export default function AdminManagementPage() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [actionId, setActionId] = useState<number | null>(null);

  const currentAdminId = getUserId();

  // add-form state
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    gender: 'Male',
    phone: '',
  });
  const [image, setImage] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  async function loadData() {
    try {
      const data = await getAllAdmins();
      setAdmins(data);
    } catch {
      setMessage('Could not load admins.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});
    setMessage('');

    const result = adminRegisterSchema.safeParse(form);
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
    fd.append('password', form.password);
    fd.append('gender', form.gender);
    fd.append('phone', form.phone);
    if (image) fd.append('image', image);

    setSaving(true);
    try {
      await createAdmin(fd);
      setMessage('Admin created successfully.');
      setShowForm(false);
      setForm({ name: '', email: '', password: '', gender: 'Male', phone: '' });
      setImage(null);
      await loadData();
    } catch (err: any) {
      setMessage(err?.response?.data?.message ?? 'Failed to create admin.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this admin permanently?')) return;
    setActionId(id);
    try {
      await deleteAdmin(id);
      setMessage('Admin deleted.');
      await loadData();
    } catch {
      setMessage('Delete failed.');
    } finally {
      setActionId(null);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold text-neutral">
            Admin Management
          </h1>
          <p className="mt-2 text-secondary">Manage administrator accounts.</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn btn-primary">
          + Add Admin
        </button>
      </div>

      {message && (
        <div className="mt-4 rounded-lg bg-info/10 px-4 py-3 text-info">{message}</div>
      )}

      {/* Admin table */}
      <div className="mt-8 overflow-x-auto rounded-xl border border-base-300 bg-base-100">
        <table className="table">
          <thead>
            <tr className="text-secondary">
              <th>Admin</th>
              <th>Email</th>
              <th>Phone</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {admins.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center text-secondary">
                  No admins found.
                </td>
              </tr>
            ) : (
              admins.map((a) => (
                <tr key={a.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 overflow-hidden rounded-full bg-base-200">
                        {a.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={`${API_URL}/uploads/${a.image}`}
                            alt={a.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-sm font-bold text-secondary">
                            {a.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <span className="font-medium text-neutral">
                        {a.name}
                        {a.id === currentAdminId && (
                          <span className="ml-2 text-xs text-primary">(You)</span>
                        )}
                      </span>
                    </div>
                  </td>
                  <td className="text-secondary">{a.email}</td>
                  <td className="text-secondary">{a.phone}</td>
                  <td className="text-right">
                    {a.id === currentAdminId ? (
                      <span className="text-xs text-secondary">—</span>
                    ) : (
                      <button
                        onClick={() => handleDelete(a.id)}
                        disabled={actionId === a.id}
                        className="btn btn-sm btn-ghost text-error"
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add Admin modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-base-100 p-8">
            <h2 className="font-[family-name:var(--font-heading)] text-xl font-bold text-neutral">
              Add New Admin
            </h2>

            <form onSubmit={handleCreate} className="mt-6 space-y-4">
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

              <FormField label="Photo (optional)">
                <input
                  type="file"
                  accept="image/png, image/jpeg"
                  className="file-input file-input-bordered w-full"
                  onChange={(e) => setImage(e.target.files?.[0] ?? null)}
                />
              </FormField>

              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="btn btn-primary flex-1">
                  {saving ? 'Creating…' : 'Create Admin'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setErrors({});
                  }}
                  className="btn btn-ghost"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}