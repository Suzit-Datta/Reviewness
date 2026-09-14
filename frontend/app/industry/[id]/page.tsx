import Link from "next/link";
import { notFound } from "next/navigation";
import { getIndustry, getIndustryCompanies } from "@/lib/api";
import DeleteIndustryButton from "@/components/DeleteIndustryButton";

export default async function IndustryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let industry;
  try {
    industry = await getIndustry(Number(id));
  } catch {
    notFound();
  }
  const companies = await getIndustryCompanies(Number(id)).catch(() => []);

  return (
    <div className="max-w-2xl mx-auto p-6 w-full">
      <Link href="/industry" className="text-sm text-primary hover:underline">← Back</Link>
      <div className="bg-white border border-slate-200 rounded-lg p-6 mt-4">
        <h1 className="text-xl font-bold text-navy">{industry.industryName}</h1>
        <div className="flex gap-3 mt-4">
          <Link href={`/industry/${industry.id}/edit`} className="bg-secondary text-white px-3 py-1.5 rounded-md text-sm hover:opacity-90">Edit</Link>
          <DeleteIndustryButton id={industry.id} />
        </div>
        <div className="mt-6">
          <h2 className="text-sm font-semibold text-navy mb-2">Companies in this industry</h2>
          {companies.length === 0 ? (
            <p className="text-secondary text-sm">No companies yet.</p>
          ) : (
            <ul className="text-sm text-secondary space-y-1">
              {companies.map((c) => (
                <li key={c.id}>{c.companyName}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}