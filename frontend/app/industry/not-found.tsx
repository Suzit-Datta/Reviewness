import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-4xl mx-auto p-6 text-center py-20">
      <h2 className="text-xl font-semibold text-navy mb-2">Industry not found</h2>
      <Link href="/industry" className="text-primary hover:underline">← Back to industries</Link>
    </div>
  );
}