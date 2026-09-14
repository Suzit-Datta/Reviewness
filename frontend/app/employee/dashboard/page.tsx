"use client";

import { useEffect, useState } from "react";
import { getCompanies, getUsers, getIndustries, Company, AppUser, Industry } from "@/lib/api";

export default function EmployeeDashboardPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [users, setUsers] = useState<AppUser[]>([]);
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [comps, usrs, inds] = await Promise.all([
        getCompanies(),
        getUsers(),
        getIndustries(),
      ]);
      setCompanies(comps);
      setUsers(usrs);
      setIndustries(inds);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <p className="text-secondary">Loading dashboard…</p>;

  const pending = companies.filter((c) => !c.isApproved).length;
  const approved = companies.filter((c) => c.isApproved).length;

  return (
    <>
      <h1 className="text-2xl font-bold text-navy mb-6">Employee Dashboard</h1>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <p className="text-secondary text-sm">Total Companies</p>
          <p className="text-2xl font-bold text-navy">{companies.length}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <p className="text-secondary text-sm">Pending Approval</p>
          <p className="text-2xl font-bold text-accent">{pending}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <p className="text-secondary text-sm">Approved</p>
          <p className="text-2xl font-bold text-success">{approved}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <p className="text-secondary text-sm">Total Users</p>
          <p className="text-2xl font-bold text-navy">{users.length}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <p className="text-secondary text-sm">Total Industries</p>
          <p className="text-2xl font-bold text-navy">{industries.length}</p>
        </div>
      </div>
    </>
  );
}