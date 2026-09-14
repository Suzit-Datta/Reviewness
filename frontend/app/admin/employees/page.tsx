'use client';

import { useEffect, useState } from 'react';
import {
  getAllEmployees,
  getPendingEmployees,
  approveEmployee,
  rejectEmployee,
  deleteEmployee,
} from '@/services/employeeService';
import { StatusBadge } from '@/components/dashboard/StatusBadge';
import Link from 'next/link';

type Employee = {
  id: number;
  userName: string;
  email: string;
  status: string;
  position?: string;
};

export default function EmployeeManagementPage() {
  const [pending, setPending] = useState<Employee[]>([]);
  const [all, setAll] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<number | null>(null);
  const [message, setMessage] = useState('');

  async function loadData() {
    try {
      const [pendingData, allData] = await Promise.all([
        getPendingEmployees(),
        getAllEmployees(),
      ]);
      setPending(pendingData);
      setAll(allData);
    } catch {
      setMessage('Could not load employees.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleApprove(id: number) {
    setActionId(id);
    try {
      await approveEmployee(id);
      setMessage('Employee approved.');
      await loadData();
    } catch {
      setMessage('Approve failed.');
    } finally {
      setActionId(null);
    }
  }

  async function handleReject(id: number) {
    setActionId(id);
    try {
      await rejectEmployee(id);
      setMessage('Employee rejected.');
      await loadData();
    } catch {
      setMessage('Reject failed.');
    } finally {
      setActionId(null);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this employee permanently?')) return;
    setActionId(id);
    try {
      await deleteEmployee(id);
      setMessage('Employee deleted.');
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
      <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold text-neutral">
        Employee Management
      </h1>
      <p className="mt-2 text-secondary">
        Approve new employees and manage the moderation team.
      </p>

      {message && (
        <div className="mt-4 rounded-lg bg-info/10 px-4 py-3 text-info">{message}</div>
      )}

      {/* PENDING APPROVALS */}
      <section className="mt-8">
        <h2 className="font-[family-name:var(--font-heading)] text-xl font-bold text-neutral">
          Pending Approvals{' '}
          <span className="ml-2 inline-flex items-center justify-center rounded-full bg-warning/20 px-2.5 py-0.5 text-sm font-semibold text-neutral">
  {pending.length}
</span>
        </h2>

        {pending.length === 0 ? (
          <p className="mt-4 rounded-xl border border-base-300 bg-base-100 p-6 text-secondary">
            No employees awaiting approval.
          </p>
        ) : (
          <div className="mt-4 space-y-3">
            {pending.map((emp) => (
              <div
                key={emp.id}
                className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-base-300 bg-base-100 p-5"
              >
                <div>
                  <p className="font-semibold text-neutral">{emp.userName}</p>
                  <p className="text-sm text-secondary">{emp.email}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleApprove(emp.id)}
                    disabled={actionId === emp.id}
                    className="btn btn-sm bg-success text-white hover:opacity-90"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(emp.id)}
                    disabled={actionId === emp.id}
                    className="btn btn-sm btn-error text-white"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ALL EMPLOYEES */}
      <section className="mt-12">
        <h2 className="font-[family-name:var(--font-heading)] text-xl font-bold text-neutral">
          All Employees
        </h2>

        <div className="mt-4 overflow-x-auto rounded-xl border border-base-300 bg-base-100">
          <table className="table">
            <thead>
              <tr className="text-secondary">
                <th>Name</th>
                <th>Email</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {all.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center text-secondary">
                    No employees yet.
                  </td>
                </tr>
              ) : (
                all.map((emp) => (
                  <tr key={emp.id}>
                    <td className="font-medium text-neutral">
                      <Link
                          href={`/admin/employees/${emp.id}`}
                            className="hover:text-primary hover:underline">
                                {emp.userName}
                                  </Link>
                          </td>
                    <td className="text-secondary">{emp.email}</td>
                    <td>
                      <StatusBadge status={emp.status} />
                    </td>
                    <td className="text-right">
                      <button
                        onClick={() => handleDelete(emp.id)}
                        disabled={actionId === emp.id}
                        className="btn btn-sm btn-ghost text-error"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}