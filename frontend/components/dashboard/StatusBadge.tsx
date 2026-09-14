export function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    APPROVED: 'bg-success/15 text-success',
    PENDING: 'bg-warning/20 text-neutral',
    REJECTED: 'bg-error/15 text-error',
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
        styles[status] ?? 'bg-base-200 text-secondary'
      }`}
    >
      {status}
    </span>
  );
}