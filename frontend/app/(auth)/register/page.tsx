import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

const options = [
  {
    title: 'Sign up as a User',
    desc: 'Read reviews and share your own experiences to help others decide.',
    href: '/register/user',
  },
  {
    title: 'Sign up as a Company',
    desc: 'Manage your products and respond to reviews from real customers.',
    href: '/register/company',
  },
  {
    title: 'Sign up as an Employee',
    desc: 'Join the moderation team. Your account needs admin approval.',
    href: '/register/employee',
  },
  {
    title: 'Sign up as an Admin',
    desc: 'Manage the platform, users, companies, and moderation.',
    href: '/register/admin',
  },
];

export default function RegisterChoicePage() {
  return (
    <div className="flex min-h-screen flex-col bg-base-200">
      <Navbar />
      <main className="mx-auto w-full max-w-5xl flex-grow px-6 py-20">
        <h1 className="font-[family-name:var(--font-heading)] text-4xl font-bold text-neutral">
          Create your account
        </h1>
        <p className="mt-3 text-lg text-secondary">
          Choose the type of account that fits you.
        </p>

       <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {options.map((opt) => (
            <Link
              key={opt.href}
              href={opt.href}
              className="flex flex-col rounded-2xl border border-base-300 bg-base-100 p-6 transition hover:border-primary hover:shadow-md"
            >
              <h2 className="font-[family-name:var(--font-heading)] text-xl font-bold text-neutral">
                {opt.title}
              </h2>
              <p className="mt-3 flex-grow leading-relaxed text-secondary">{opt.desc}</p>
              <span className="mt-4 font-medium text-primary">Get started →</span>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
