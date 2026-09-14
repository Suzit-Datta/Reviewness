"use client";

import { useEffect, useState } from "react";
import { getCompanies, approveCompany, rejectCompany, Company } from "@/lib/api";
import RequireStaff from "@/components/RequireStaff";

function CompanyListContent() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const data = await getCompanies();
    setCompanies(data);
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

  return (
    <>
      <h1 className="text-2xl font-bold text-navy mb-6">Companies</h1>
      <div className="space-y-3">
        {companies.map((c) => (
          <div
            key={c.id}
            className="flex items-center justify-between bg-white border border-slate-200 rounded-lg p-4"
          >
            <div>
              <p className="font-medium text-navy">{c.companyName}</p>
              <p className="text-sm text-secondary">{c.email}</p>
              <p className="text-sm mt-1">
                Status:{" "}
                <span
                  className={
                    c.isApproved ? "text-success font-medium" : "text-danger font-medium"
                  }
                >
                  {c.isApproved ? "Approved" : "Pending"}
                </span>
              </p>
            </div>
            <div className="flex gap-2">
              {!c.isApproved && (
                <button
                  onClick={() => handleApprove(c.id)}
                  className="bg-success text-white px-3 py-1.5 rounded-md text-sm hover:opacity-90"
                >
                  Approve
                </button>
              )}
              {c.isApproved && (
                <button
                  onClick={() => handleReject(c.id)}
                  className="bg-danger text-white px-3 py-1.5 rounded-md text-sm hover:opacity-90"
                >
                  Revoke
                </button>
              )}
            </div>
          </div>
        ))}
        {companies.length === 0 && (
          <p className="text-secondary text-center py-10">No companies yet.</p>
        )}
      </div>
    </>
  );
}

export default function CompanyListPage() {
  return (
    <div className="max-w-3xl mx-auto p-6 w-full">
      <RequireStaff>
        <CompanyListContent />
      </RequireStaff>
    </div>
  );
}