import { LoginForm } from '@/components/auth/LoginForm';

export function LoginCta() {
  return (
    <section className="bg-base-200">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-2">
        <div>
          <h2 className="font-[family-name:var(--font-heading)] text-4xl font-bold leading-tight text-neutral md:text-5xl">
            Your experience can help someone choose.
          </h2>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-secondary">
            Join a community that values detail, balance, and honest opinions over hype.
          </p>
          <div className="mt-8 flex items-center gap-3">
            <span className="text-accent text-xl tracking-wide">★★★★★</span>
            <span className="font-[family-name:var(--font-heading)] font-bold text-neutral">
              Every perspective adds value.
            </span>
          </div>
        </div>
        <LoginForm />
      </div>
    </section>
  );
}