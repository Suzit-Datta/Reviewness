import Link from 'next/link';
import { footerLinks } from '@/lib/constants';

export function Footer() {
  return (
    <footer className="border-t border-base-300 bg-base-100">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-10">
        <div>
         <Link href="/" > <span className="font-[family-name:var(--font-heading)] text-xl font-bold text-primary">
            Reviewness<span className="text-accent">.</span>
          </span></Link>
          <p className="mt-1 text-secondary">Better choices start with honest reviews.</p>
        </div>
        <div className="flex flex-wrap gap-6 text-neutral">
          {footerLinks.map((link) => (
            <Link key={link.label} href={link.href} className="hover:text-primary">
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}