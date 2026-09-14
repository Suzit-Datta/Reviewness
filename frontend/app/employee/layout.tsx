"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import RequireStaff from "@/components/RequireStaff";
import { clearAuth } from "@/lib/auth";

const links = [
  { href: "/employee/dashboard", label: "Dashboard" },
  { href: "/employee/companies", label: "Companies" },
  { href: "/employee/industries", label: "Industries" },
  { href: "/employee/users", label: "Users" },
];

export default function EmployeeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  function handleLogout() {
    clearAuth();
    router.push("/login");
  }

  return (
    <RequireStaff>
      <div className="min-h-screen bg-slate-50">
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-5xl mx-auto px-6 flex items-center justify-between">
            <nav className="flex gap-1">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-3 text-sm font-medium border-b-2 ${
                    pathname === link.href
                      ? "border-primary text-primary"
                      : "border-transparent text-secondary hover:text-navy"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <button
              onClick={handleLogout}
              className="text-sm text-secondary hover:text-danger"
            >
              Logout
            </button>
          </div>
        </div>
        <div className="max-w-5xl mx-auto p-6">{children}</div>
      </div>
    </RequireStaff>
  );
}