'use client';

import { useEffect, useState } from 'react';
import { StatCard } from '@/components/dashboard/StatCard';
import { getAllAdmins } from '@/services/adminService';
import { getAllEmployees, getPendingEmployees } from '@/services/employeeService';
import { getAllCompanies } from '@/services/companyService';
import { SUBSCRIPTION_PRICE } from '@/lib/constants';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    admins: 0,
    employees: 0,
    pending: 0,
    companies: 0,
    subscribed: 0,
    revenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [admins, employees, pending, companies] = await Promise.all([
          getAllAdmins(),
          getAllEmployees(),
          getPendingEmployees(),
          getAllCompanies(),
        ]);

        const subscribed = companies.filter(
          (c: { isSubscribe: boolean }) => c.isSubscribe,
        ).length;

        setStats({
          admins: admins.length,
          employees: employees.length,
          pending: pending.length,
          companies: companies.length,
          subscribed,
          revenue: subscribed * SUBSCRIPTION_PRICE,
        });
      } catch {
        // counts stay 0 on error
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div>
      <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold text-neutral">
        Dashboard
      </h1>
      <p className="mt-2 text-secondary">Overview of the Reviewness platform.</p>

      {loading ? (
        <div className="mt-10 flex justify-center">
          <span className="loading loading-spinner loading-lg text-primary" />
        </div>
      ) : (
        <>
          {/* Main counts */}
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Total Admins" value={stats.admins} href="/admin/admins" />
            <StatCard label="Total Employees" value={stats.employees} href="/admin/employees" />
            <StatCard label="Pending Approvals" value={stats.pending} href="/admin/employees" />
            <StatCard label="Total Companies" value={stats.companies} href="/admin/companies" />
          </div>

          {/* Subscription revenue */}
          <h2 className="mt-12 font-[family-name:var(--font-heading)] text-xl font-bold text-neutral">
            Subscriptions
          </h2>
          <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <StatCard
              label="Subscribed Companies"
              value={stats.subscribed}
              href="/admin/companies"
            />
            <StatCard
              label="Subscription Revenue"
              value={`$${stats.revenue.toLocaleString()}`}
            />
            <StatCard label="Price per Subscription" value={`$${SUBSCRIPTION_PRICE}`} />
          </div>
        </>
      )}
    </div>
  );
}