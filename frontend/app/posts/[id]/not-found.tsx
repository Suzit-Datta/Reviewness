import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-base-200 px-6">
      <div className="text-center">
        <p className="font-semibold text-primary">Reviewness</p>

        <h1 className="mt-3 font-[family-name:var(--font-heading)] text-5xl font-bold text-neutral">
          Review not found
        </h1>

        <p className="mt-4 text-secondary">
          The review you are looking for does not exist.
        </p>

        <Link href="/feed" className="btn btn-primary mt-8">
          Return to Feed
        </Link>
      </div>
    </main>
  );
}
