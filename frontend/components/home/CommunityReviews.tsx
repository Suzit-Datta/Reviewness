import Link from 'next/link';
import { sampleReviews } from '@/lib/constants';
import { ReviewCard } from '@/components/ui/ReviewCard';

export function CommunityReviews() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-[family-name:var(--font-heading)] text-4xl font-bold text-neutral">
            What the community is reviewing
          </h2>
          <p className="mt-3 text-lg text-secondary">
            Detailed experiences with products people use every day.
          </p>
        </div>
        <Link href="/login" className="font-medium text-primary hover:underline">
          Explore all reviews →
        </Link>
      </div>
      <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {sampleReviews.map((review) => (
          <ReviewCard key={review.product} review={review} />
        ))}
      </div>
    </section>
  );
}