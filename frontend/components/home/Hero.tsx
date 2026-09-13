import Link from 'next/link';

export function Hero() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <div className="grid gap-12 lg:grid-cols-2">
        <div>
          <div className="mb-6 flex items-center gap-3">
            <span className="text-accent text-xl tracking-wide">★★★★★</span>
            <span className="font-medium text-secondary">Reviews from real people</span>
          </div>
          <h1 className="font-[family-name:var(--font-heading)] text-5xl font-bold leading-tight text-neutral md:text-6xl">
            Buy with confidence, backed by real reviews.
          </h1>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-secondary">
            Reviewness brings honest product experiences into one trustworthy place,
            so you can decide what is truly worth buying.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link href="/register" className="btn btn-primary btn-lg">Sign up</Link>
            <Link href="/login" className="btn btn-outline btn-lg">Browse reviews</Link>
          </div>
        </div>
        <div className="flex items-center border-l border-base-300 pl-10">
          <div>
            <p className="font-[family-name:var(--font-heading)] text-2xl font-bold leading-snug text-neutral">
              &ldquo;I want the review that tells me what a product is like after the
              excitement wears off.&rdquo;
            </p>
            <p className="mt-4 text-secondary">
              The kind of perspective Reviewness is built for.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}