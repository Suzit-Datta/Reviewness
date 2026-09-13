export function Stars({ rating }: { rating: number }) {
  const filled = Math.round(rating);
  return (
    <div className="flex items-center gap-2">
      <div className="flex text-accent text-lg" aria-label={`${rating} out of 5 stars`}>
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={i} className={i < filled ? 'text-accent' : 'text-base-300'}>
            ★
          </span>
        ))}
      </div>
      <span className="font-[family-name:var(--font-heading)] font-bold text-neutral">
        {rating}/5
      </span>
    </div>
  );
}