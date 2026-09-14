'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { getEmployeeById } from '@/services/employeeService';
import { StatusBadge } from '@/components/dashboard/StatusBadge';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type Employee = {
  id: number;
  userName: string;
  email: string;
  image?: string;
  position?: string;
  status: string;
  createdAt: string;
  approvedByAdmin?: { id: number; name: string } | null;
};

const statusColor: Record<string, 'success' | 'warning' | 'error'> = {
  APPROVED: 'success',
  PENDING: 'warning',
  REJECTED: 'error',
};

export default function EmployeeDetailPage() {
  const params = useParams();
  const id = Number(params.id);

  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    getEmployeeById(id)
      .then(setEmployee)
      .catch(() => setError('Could not load this employee.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  if (error || !employee) {
    return (
      <div>
        <p className="text-error">{error || 'Employee not found.'}</p>
        <Link href="/admin/employees" className="mt-4 inline-block text-primary hover:underline">
          ← Back to employees
        </Link>
      </div>
    );
  }

  const joined = new Date(employee.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div>
      <Link href="/admin/employees" className="text-sm text-primary hover:underline">
        ← Back to employees
      </Link>

      <div className="mt-4 rounded-2xl border border-base-300 bg-base-100 p-8">
        {/* Header */}
        <div className="flex items-center gap-6">
          <div className="h-24 w-24 overflow-hidden rounded-full bg-base-200">
            {employee.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={`${API_URL}/uploads/${employee.image}`}
                alt={employee.userName}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center font-[family-name:var(--font-heading)] text-3xl font-bold text-secondary">
                {employee.userName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div>
            <h1 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-neutral">
              {employee.userName}
            </h1>
            <div className="mt-2">
              <StatusBadge status={employee.status} />
            </div>
          </div>
        </div>

        {/* Details */}
        <dl className="mt-8 grid gap-6 sm:grid-cols-2">
          <Detail label="Email" value={employee.email} />
          <Detail label="Position" value={employee.position || '—'} />
          <Detail label="Joined" value={joined} />
          <Detail
            label="Approved by"
            value={employee.approvedByAdmin?.name ?? 'Not yet approved'}
          />
        </dl>
      </div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-sm font-medium text-secondary">{label}</dt>
      <dd className="mt-1 font-medium text-neutral">{value}</dd>
    </div>
  );
}