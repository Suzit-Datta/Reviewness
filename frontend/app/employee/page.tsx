"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  getEmployees,
  getCompanies,
  approveCompany,
  rejectCompany,
  searchEmployees,
  Employee,
  Company,
} from "@/lib/api";
import EmployeeCard from "@/components/EmployeeCard";
import RequireAdmin from "@/components/RequireAdmin";

function EmployeeDashboardContent() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);

  async function loadAll() {
    setLoading(true);
    const [emps, comps] = await Promise.all([getEmployees(), getCompanies()]);
    setEmployees(emps);
    setCompanies(comps);
    setLoading(false);
  }

  useEffect(() => {
    loadAll();
  }, []);

  async function handleApprove(id: number) {
    await approveCompany(id);
    loadAll();
  }

  async function handleReject(id: number) {
    if (!confirm("Reject this company?")) return;
    await rejectCompany(id);
    loadAll();
  }

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return loadAll();
    setSearching(true);
    const results = await searchEmployees(query);
    setEmployees(results);
    setSearching(false);
  }

  if (loading) return <p className="text-secondary">Loading dashboard…</p>;

  const pendingCompanies = companies.filter((c) => !c.isApproved);
  const approvedCompanies = companies.filter((c) => c.isApproved);

  return (
    <>
      <h1 className="text-2xl font-bold text-navy mb-6">Employee Dashboard</h1>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <p className="text-secondary text-sm">Total Employees</p>
          <p className="text-2xl font-bold text-navy">{employees.length}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <p className="text-secondary text-sm">Pending Company Approvals</p>
          <p className="text-2xl font-bold text-accent">{pendingCompanies.length}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <p className="text-secondary text-sm">Approved Companies</p>
          <p className="text-2xl font-bold text-success">{approvedCompanies.length}</p>
        </div>
      </div>

      {pendingCompanies.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-navy mb-3">
            Pending Company Approvals
          </h2>
          <div className="space-y-2">
            {pendingCompanies.map((company) => (
              <div
                key={company.id}
                className="flex items-center justify-between bg-white border border-slate-200 rounded-lg p-4"
              >
                <div>
                  <p className="font-medium text-navy">{company.companyName}</p>
                  <p className="text-sm text-secondary">{company.email}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleApprove(company.id)}
                    className="bg-success text-white px-3 py-1.5 rounded-md text-sm hover:opacity-90"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(company.id)}
                    className="bg-danger text-white px-3 py-1.5 rounded-md text-sm hover:opacity-90"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-navy">All Employees</h2>
        <Link
          href="/employee/new"
          className="bg-primary text-white px-4 py-2 rounded-md hover:opacity-90 text-sm"
        >
          + New Employee
        </Link>
      </div>

      <form onSubmit={handleSearch} className="flex gap-2 mb-4">
        <input
          className="flex-1 border border-slate-300 rounded-md px-3 py-2"
          placeholder="Search by username…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          type="submit"
          disabled={searching}
          className="bg-secondary text-white px-4 py-2 rounded-md text-sm hover:opacity-90"
        >
          Search
        </button>
      </form>

      <div className="grid gap-4 sm:grid-cols-2">
        {employees.map((emp) => (
          <EmployeeCard key={emp.id} employee={emp} />
        ))}
      </div>
      {employees.length === 0 && (
        <p className="text-secondary text-center py-10">No employees found.</p>
      )}
    </>
  );
}

export default function EmployeeDashboardPage() {
  return (
    <div className="max-w-4xl mx-auto p-6 w-full">
      <RequireAdmin>
        <EmployeeDashboardContent />
      </RequireAdmin>
    </div>
  );
}