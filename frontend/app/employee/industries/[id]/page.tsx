"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getIndustry, getIndustryCompanies, Industry, Company } from "@/lib/api";

export default function IndustryDetailPage() {
  const params = useParams<{ id: string }>();
  const [industry, setIndustry] = useState<Industry | null>(null);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const id = Number(params.id);
      const [ind, comps] = await Promise.all([
        getIndustry(id),
        getIndustryCompanies(id),
      ]);
      setIndustry(ind);
      setCompanies(comps);
      setLoading(false);
    }
    load();
  }, [params.id]);

  if (loading) return <p className="text-secondary">Loading…</p>;
  if (!industry) return <p className="text-danger">Industry not found.</p>;

  return (
    <>
      <Link href="/employee/industries" className="text-sm text-primary hover:underline">
        ← Back to Industries
      </Link>
      <h1 className="text-2xl font-bold text-navy mt-2 mb-6">
        {industry.industryName}
      </h1>

      <h2 className="text-lg font-semibold text-navy mb-3">
        Companies in this industry ({companies.length})
      </h2>
      {companies.length === 0 ? (
        <p className="text-secondary text-sm">No companies in this industry yet.</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {companies.map((company) => (
            <div
              key={company.id}
              className="bg-white border border-slate-200 rounded-lg p-4"
            >
              <p className="font-medium text-navy">{company.companyName}</p>
              <p className="text-sm text-secondary">{company.email}</p>
            </div>
          ))}
        </div>
      )}
    </>
  );
}