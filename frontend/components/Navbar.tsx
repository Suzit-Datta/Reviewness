import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-navy px-6 py-4 flex items-center gap-6">
      <span className="font-bold text-white text-lg">
        Reviewness<span className="text-accent">.</span>
      </span>
      <Link href="/industry" className="text-white/80 hover:text-white text-sm">
        Industries
      </Link>
      <Link href="/company" className="text-white/80 hover:text-white text-sm">
        Companies
      </Link>
      <Link href="/users" className="text-white/80 hover:text-white text-sm">
        Users
      </Link>
      <Link href="/employee" className="text-white/80 hover:text-white text-sm">
        Employees
      </Link>
    </nav>
  );
}