import Link from "next/link";
import { Industry } from "@/lib/api";

export default function IndustryCard({ industry }: { industry: Industry }) {
  return (
    <Link
      href={`/industry/${industry.id}`}
      className="block bg-white border border-slate-200 rounded-lg p-4 hover:border-primary transition"
    >
      <p className="font-medium text-navy">{industry.industryName}</p>
    </Link>
  );
}