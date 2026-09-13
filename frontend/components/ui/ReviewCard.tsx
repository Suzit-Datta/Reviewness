import type { Review } from '@/types';
import { Stars } from './Stars';

export function ReviewCard({ review }: { review: Review }) {
  return (
    <article className="flex flex-col rounded-2xl border border-base-300 bg-base-100 p-6">
      <span className="badge badge-ghost mb-4 self-start">{review.category}</span>
      <h3 className="font-[family-name:var(--font-heading)] text-xl font-bold text-neutral">
        {review.product}
      </h3>
      <div className="mt-3">
        <Stars rating={review.rating} />
      </div>
      <p className="mt-4 flex-grow leading-relaxed text-secondary">{review.text}</p>
      <div className="mt-6 flex items-center gap-2 border-t border-base-300 pt-4 text-sm">
        <span className="font-semibold text-neutral">{review.reviewer}</span>
        <span className="text-base-300">•</span>
        <span className="text-secondary">{review.date}</span>
      </div>
    </article>
  );
}