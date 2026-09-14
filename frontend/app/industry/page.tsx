import Link from "next/link";
import { getIndustries } from "@/lib/api";
import IndustryCard from "@/components/IndustryCard";

export default async function IndustryListPage() {
  const industries = await getIndustries();
  return (
    <div className="max-w-4xl mx-auto p-6 w-full">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-navy">Industries</h1>
        <Link href="/industry/new" className="bg-primary text-white px-4 py-2 rounded-md hover:opacity-90">
          + New Industry
        </Link>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {industries.map((ind) => (
          <IndustryCard key={ind.id} industry={ind} />
        ))}
      </div>
      {industries.length === 0 && (
        <p className="text-secondary text-center py-10">No industries yet.</p>
      )}
    </div>
  );
}