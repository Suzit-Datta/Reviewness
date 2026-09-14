import Link from 'next/link';

export function StatCard({
  label,
  value,
  href,
}: {
  label: string;
  value: number | string;
  href?: string;
}) {
  const inner = (
    <div className="rounded-2xl border border-base-300 bg-base-100 p-6 transition hover:border-primary">
      <p className="text-sm font-medium text-secondary">{label}</p>
      <p className="mt-2 font-[family-name:var(--font-heading)] text-3xl font-bold text-neutral">
        {value}
      </p>
    </div>
  );

  return href ? <Link href={href}>{inner}</Link> : inner;
}