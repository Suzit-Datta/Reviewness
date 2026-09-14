import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-4xl mx-auto p-6 text-center py-20">
      <h2 className="text-xl font-semibold text-slate-900 mb-2">
        Employee not found
      </h2>
      <p className="text-slate-500 mb-4">
        The employee you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link href="/employee" className="text-primary hover:underline">
        ← Back to employees
      </Link>
    </div>
  );
}