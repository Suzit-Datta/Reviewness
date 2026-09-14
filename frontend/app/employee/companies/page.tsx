"use client";

import { useEffect, useState } from "react";
import { getCompanies, approveCompany, rejectCompany, Company } from "@/lib/api";

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    setCompanies(await getCompanies());
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleApprove(id: number) {
    await approveCompany(id);
    load();
  }

  async function handleReject(id: number) {
    if (!confirm("Reject this company?")) return;
    await rejectCompany(id);
    load();
  }

  if (loading) return <p className="text-secondary">Loading companies…</p>;

  const pending = companies.filter((c) => !c.isApproved);
  const approved = companies.filter((c) => c.isApproved);

  return (
    <>
      <h1 className="text-2xl font-bold text-navy mb-6">Companies</h1>

      {pending.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-navy mb-3">Pending Approval</h2>
          <div className="space-y-2">
            {pending.map((company) => (
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

      <h2 className="text-lg font-semibold text-navy mb-3">All Companies</h2>
      {companies.length === 0 ? (
        <p className="text-secondary text-sm">No companies found.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {companies.map((company) => (
            <div
              key={company.id}
              className="bg-white border border-slate-200 rounded-lg p-4 flex items-center justify-between"
            >
              <div>
                <p className="font-medium text-navy">{company.companyName}</p>
                <p className="text-sm text-secondary">{company.email}</p>
                {company.location && (
                  <p className="text-xs text-secondary">{company.location}</p>
                )}
              </div>
              <span
                className={`text-xs font-medium px-2 py-1 rounded-full ${
                  company.isApproved
                    ? "bg-success/10 text-success"
                    : "bg-accent/10 text-accent"
                }`}
              >
                {company.isApproved ? "Approved" : "Pending"}
              </span>
            </div>
          ))}
        </div>
      )}
    </>
  );
}