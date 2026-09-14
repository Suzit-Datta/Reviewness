"use client";

import { useState } from "react";
import Link from "next/link";
import { createIndustry, deleteIndustry, Industry } from "@/lib/api";

export default function IndustriesClient({
  initialIndustries,
}: {
  initialIndustries: Industry[];
}) {
  const [industries, setIndustries] = useState<Industry[]>(initialIndustries);
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setSubmitting(true);
    const created = await createIndustry({ industryName: name });
    setIndustries([...industries, created]);
    setName("");
    setSubmitting(false);
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this industry?")) return;
    await deleteIndustry(id);
    setIndustries(industries.filter((i) => i.id !== id));
  }

  return (
    <>
      <h1 className="text-2xl font-bold text-navy mb-6">Industries</h1>

      <form onSubmit={handleCreate} className="flex gap-2 mb-6">
        <input
          className="flex-1 border border-slate-300 rounded-md px-3 py-2"
          placeholder="New industry name…"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button
          type="submit"
          disabled={submitting}
          className="bg-primary text-white px-4 py-2 rounded-md text-sm hover:opacity-90"
        >
          {submitting ? "Adding…" : "Add Industry"}
        </button>
      </form>

      {industries.length === 0 ? (
        <p className="text-secondary text-sm">No industries yet.</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {industries.map((industry) => (
            <div
              key={industry.id}
              className="bg-white border border-slate-200 rounded-lg p-4 flex items-center justify-between"
            >
              <Link
                href={`/employee/industries/${industry.id}`}
                className="font-medium text-navy hover:text-primary"
              >
                {industry.industryName}
              </Link>
              <button
                onClick={() => handleDelete(industry.id)}
                className="text-danger text-sm hover:underline"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  );
}