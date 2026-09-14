"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter, useParams } from "next/navigation";
import { getIndustry, updateIndustry } from "@/lib/api";

export default function EditIndustryPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getIndustry(Number(params.id)).then((ind) => {
      setName(ind.industryName);
      setLoading(false);
    });
  }, [params.id]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) return setError("Industry name is required");
    setSubmitting(true);
    try {
      await updateIndustry(Number(params.id), { industryName: name });
      router.push(`/industry/${params.id}`);
      router.refresh();
    } catch (err) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Something went wrong";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <p className="max-w-md mx-auto p-6 text-secondary">Loading…</p>;

  return (
    <div className="max-w-md mx-auto p-6 w-full">
      <h1 className="text-xl font-bold text-navy mb-4">Edit Industry</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-navy mb-1">Industry Name</label>
          <input
            className="w-full border border-slate-300 rounded-md px-3 py-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        {error && <p className="text-danger text-sm">{error}</p>}
        <button type="submit" disabled={submitting} className="w-full bg-primary text-white py-2 rounded-md hover:opacity-90 disabled:opacity-50">
          {submitting ? "Saving…" : "Save Changes"}
        </button>
      </form>
    </div>
  );
}